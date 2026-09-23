use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    error,
    logger::enums::category::Category,
    persistence::{
        models::{CustomList, MediaItem},
        table_utils::media_items,
    },
};

const ENSURE_CUSTOM_LIST_ID_EXISTS_QUERY: &str = r#"
    SELECT id
    FROM custom_lists
    WHERE id = $1
        AND user_id = $2
    "#;

const ENSURE_CUSTOM_LIST_NAME_NOT_EXISTS_QUERY: &str = r#"
    SELECT id
    FROM custom_lists
    WHERE name = $1
        AND user_id = $2
    "#;

const GET_CUSTOM_LISTS_QUERY: &str = r#"
    SELECT
        cl.id,
        cl.name,
        cl.user_id,
        cl.created_at,
        cl.updated_at,
        COALESCE(
            (
                SELECT array_agg(
                    x.poster_path
                    ORDER BY x.added_at, x.media_item_id
                )
                FROM (
                    SELECT
                        cli.media_item_id,
                        cli.added_at,
                        mi.poster_path
                    FROM custom_list_items AS cli
                    JOIN media_items AS mi
                        ON mi.id = cli.media_item_id
                    WHERE cli.list_id = cl.id
                    AND mi.poster_path IS NOT NULL
                    ORDER BY cli.added_at, cli.media_item_id
                    LIMIT 4
                ) AS x
            ),
            '{}'::text[]
        ) AS preview_posters
    FROM custom_lists AS cl
    WHERE cl.user_id = $1
    ORDER BY cl.created_at, cl.id;
    "#;

const UPDATE_CUSTOM_LIST_QUERY: &str = r#"
    UPDATE custom_lists
    SET name = $1, updated_at = NOW()
    WHERE id = $2 AND user_id = $3
    "#;

const DELETE_CUSTOM_LIST_QUERY: &str = "DELETE FROM custom_lists WHERE id = $1 AND user_id = $2";

const GET_MEDIA_ITEMS_IN_LIST_QUERY: &str = r#"
    SELECT kind, title, poster_path, release_date, external_source, external_id
    FROM media_items
    INNER JOIN custom_list_items
        ON custom_list_items.media_item_id = media_items.id
    INNER JOIN custom_lists
        ON custom_lists.id = custom_list_items.list_id
    WHERE custom_list_items.list_id = $1 AND custom_lists.user_id = $2
    ORDER BY custom_list_items.added_at, custom_list_items.media_item_id
    "#;

const ADD_MEDIA_ITEM_TO_LIST_QUERY: &str = r#"
    INSERT INTO custom_list_items (list_id, media_item_id)
    SELECT $1, $2
    FROM custom_lists
    WHERE custom_lists.id = $1 AND custom_lists.user_id = $3
    "#;

const DELETE_MEDIA_ITEM_FROM_LIST_QUERY: &str = r#"
    DELETE FROM custom_list_items
    USING custom_lists, media_items
    WHERE custom_list_items.list_id = $1
        AND custom_list_items.media_item_id = media_items.id
        AND media_items.kind = $2
        AND media_items.external_source = $3
        AND media_items.external_id = $4
        AND custom_lists.id = custom_list_items.list_id
        AND custom_lists.user_id = $5
    "#;

/**
 * Ensure that the given id results in an existing custom list or return error
 */
pub async fn ensure_custom_list_id_exists(pool: &PgPool, list_id: i64, user_id: i64) -> Result<(), AppError> {
    let result: Option<i64> = sqlx::query_scalar(ENSURE_CUSTOM_LIST_ID_EXISTS_QUERY)
        .bind(list_id)
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Ensuring custom list id exists for user failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Custom list does not exist."),
        )),
    }
}

/**
 * Ensure that the given name results in no existing custom list or return error
 */
pub async fn ensure_custom_list_name_not_exists(
    pool: &PgPool,
    list_name: String,
    user_id: i64,
) -> Result<(), AppError> {
    let result: Option<i64> = sqlx::query_scalar(ENSURE_CUSTOM_LIST_NAME_NOT_EXISTS_QUERY)
        .bind(list_name)
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Ensuring custom list name not exists for user failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    match result {
        Some(_) => Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Custom list with this name already exists."),
        )),
        None => Ok(()),
    }
}

/**
 * Get all custom lists of a user
 */
pub async fn get_custom_lists(pool: &PgPool, user_id: i64) -> Result<Vec<CustomList>, AppError> {
    sqlx::query_as(GET_CUSTOM_LISTS_QUERY)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Getting custom lists for user failed with error: {:#?}", err
            );
            AppError::generic_500()
        })
}

/**
 * Create a custom list and get its id
 */
pub async fn create_custom_list(pool: &PgPool, user_id: i64, list_name: &str) -> Result<i64, AppError> {
    let list_name = list_name.trim();

    let list_name_length = list_name.chars().count();
    if !(list_name_length > 0 && list_name_length <= 60) {
        return Err(AppError {
            status_code: StatusCode::BAD_REQUEST,
            message: String::from("List name length has to be at least 1 and at most 60 characters"),
        });
    }

    ensure_custom_list_name_not_exists(pool, list_name.to_string(), user_id).await?;

    sqlx::query_scalar(
        r#"
        INSERT INTO custom_lists (name, user_id)
        VALUES ($1, $2)
        RETURNING id
        "#,
    )
    .bind(list_name)
    .bind(user_id)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        if let sqlx::Error::Database(database_error) = &err
            && database_error.constraint() == Some("custom_lists_user_id_name_key")
        {
            return AppError::new(StatusCode::BAD_REQUEST, String::from("Custom list does already exist."));
        }

        error!(Category::Db, "Creating custom list failed with error: {:#?}", err);
        AppError::generic_500()
    })
}

/**
 * Update a custom list name
 */
pub async fn update_custom_list(pool: &PgPool, user_id: i64, list_id: i64, list_name: &str) -> Result<(), AppError> {
    let list_name = list_name.trim();

    let list_name_length = list_name.chars().count();
    if !(list_name_length > 0 && list_name_length <= 60) {
        return Err(AppError {
            status_code: StatusCode::BAD_REQUEST,
            message: String::from("List name length has to be at least 1 and at most 60 characters"),
        });
    }

    let result = sqlx::query(UPDATE_CUSTOM_LIST_QUERY)
        .bind(list_name)
        .bind(list_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            if let sqlx::Error::Database(database_error) = &err
                && database_error.constraint() == Some("custom_lists_user_id_name_key")
            {
                return AppError::new(StatusCode::BAD_REQUEST, String::from("Custom list does already exist."));
            }

            error!(Category::Db, "Updating custom list failed with error: {:#?}", err);
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Custom list does not exist."),
        ));
    }

    Ok(())
}

/**
 * Delete a custom list
 */
pub async fn delete_custom_list(pool: &PgPool, user_id: i64, list_id: i64) -> Result<(), AppError> {
    let result = sqlx::query(DELETE_CUSTOM_LIST_QUERY)
        .bind(list_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            error!(Category::Db, "Deleting custom list failed with error: {:#?}", err);
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Custom list does not exist."),
        ));
    }

    Ok(())
}

/**
 * Get all media items in a list
 */
pub async fn get_media_items_in_list(pool: &PgPool, user_id: i64, list_id: i64) -> Result<Vec<MediaItem>, AppError> {
    ensure_custom_list_id_exists(pool, list_id, user_id).await?;

    sqlx::query_as(GET_MEDIA_ITEMS_IN_LIST_QUERY)
        .bind(list_id)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Getting media items in custom list failed with error: {:#?}", err
            );
            AppError::generic_500()
        })
}

/**
 * Add a media item to a custom list
 */
pub async fn add_media_item_to_list(
    pool: &PgPool,
    user_id: i64,
    list_id: i64,
    media_item: MediaItem,
) -> Result<(), AppError> {
    let media_item_id = media_items::upsert_media_item(pool, media_item).await?;

    let result = sqlx::query(ADD_MEDIA_ITEM_TO_LIST_QUERY)
        .bind(list_id)
        .bind(media_item_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            if let sqlx::Error::Database(database_error) = &err
                && database_error.constraint() == Some("custom_list_items_pkey")
            {
                return AppError::new(
                    StatusCode::BAD_REQUEST,
                    String::from("Media item is already in custom list."),
                );
            }

            error!(
                Category::Db,
                "Adding media item to custom list failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Custom list does not exist."),
        ));
    }

    Ok(())
}

/**
 * Delete a media item from a custom list
 */
pub async fn delete_media_item_from_list(
    pool: &PgPool,
    user_id: i64,
    list_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i64,
) -> Result<(), AppError> {
    let result = sqlx::query(DELETE_MEDIA_ITEM_FROM_LIST_QUERY)
        .bind(list_id)
        .bind(kind)
        .bind(external_source)
        .bind(external_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Removing media item from custom list failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Media item is not in the custom list."),
        ));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_custom_list_query_scopes_access_to_the_requesting_user() {
        let scoped_queries = [
            (ENSURE_CUSTOM_LIST_ID_EXISTS_QUERY, "user_id = $"),
            (ENSURE_CUSTOM_LIST_NAME_NOT_EXISTS_QUERY, "user_id = $"),
            (GET_CUSTOM_LISTS_QUERY, "user_id = $"),
            (UPDATE_CUSTOM_LIST_QUERY, "user_id = $"),
            (DELETE_CUSTOM_LIST_QUERY, "user_id = $"),
            (GET_MEDIA_ITEMS_IN_LIST_QUERY, "custom_lists.user_id = $"),
            (ADD_MEDIA_ITEM_TO_LIST_QUERY, "custom_lists.user_id = $"),
            (DELETE_MEDIA_ITEM_FROM_LIST_QUERY, "custom_lists.user_id = $"),
        ];

        for (query, user_scope) in scoped_queries {
            assert!(query.contains(user_scope), "query is missing user scope: {query}");
        }
    }
}
