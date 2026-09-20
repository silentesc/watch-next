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

/**
 * Ensure that the given id results in an existing custom list or return error
 */
pub async fn ensure_custom_list_id_exists(pool: &PgPool, list_id: i64, user_id: i64) -> Result<(), AppError> {
    let result: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM custom_lists
        WHERE id = $1
            AND user_id = $2
        "#,
    )
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
    let result: Option<i64> = sqlx::query_scalar(
        r#"
        SELECT id
        FROM custom_lists
        WHERE name = $1
            AND user_id = $2
        "#,
    )
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
            StatusCode::NOT_FOUND,
            String::from("Custom list with this name already exists."),
        )),
        None => Ok(()),
    }
}

/**
 * Get all custom lists of a user
 */
pub async fn get_custom_lists(pool: &PgPool, user_id: i64) -> Result<Vec<CustomList>, AppError> {
    sqlx::query_as(
        r#"
        SELECT *
        FROM custom_lists
        WHERE user_id = $1
        ORDER BY created_at
        "#,
    )
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

    let result = sqlx::query(
        r#"
        UPDATE custom_lists
        SET name = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        "#,
    )
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
    let result = sqlx::query("DELETE FROM custom_lists WHERE id = $1 AND user_id = $2")
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

    sqlx::query_as(
        r#"
        SELECT *
        FROM media_items
        INNER JOIN custom_list_items
            ON custom_list_items.media_item_id = media_items.id
        INNER JOIN custom_lists
            ON custom_lists.id = custom_list_items.list_id
        WHERE custom_list_items.list_id = $1 AND custom_lists.user_id = $2
        ORDER BY custom_list_items.added_at
        "#,
    )
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
    kind: &str,
    external_source: &str,
    external_id: i64,
) -> Result<(), AppError> {
    let media_item_id = media_items::upsert_media_item(pool, kind, external_source, external_id).await?;

    let result = sqlx::query(
        r#"
        INSERT INTO custom_list_items (list_id, media_item_id)
        SELECT $1, $2
        FROM custom_lists
        WHERE custom_lists.id = $1 AND custom_lists.user_id = $3
        "#,
    )
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
    let result = sqlx::query(
        r#"
        DELETE FROM custom_list_items
        USING custom_lists, media_items
        WHERE custom_list_items.list_id = $1
            AND custom_list_items.media_item_id = media_items.id
            AND media_items.kind = $2
            AND media_items.external_source = $3
            AND media_items.external_id = $4
            AND custom_lists.id = custom_list_items.list_id
            AND custom_lists.user_id = $5
        "#,
    )
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
