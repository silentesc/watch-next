use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    error,
    features::tags::dto::UntagMediaItemRequest,
    logger::enums::category::Category,
    persistence::{
        models::{MediaItem, MediaItemTree, Tag},
        table_utils::media_items,
    },
};

const ENSURE_TAG_ID_EXISTS_QUERY: &str = r#"
    SELECT id
    FROM tags
    WHERE id = $1
        AND user_id = $2
    "#;

const ENSURE_TAG_NAME_NOT_EXISTS_QUERY: &str = r#"
    SELECT id
    FROM tags
    WHERE name = $1
        AND user_id = $2
    "#;

const GET_TAGS_QUERY: &str = r#"
    SELECT id, name, user_id, created_at, updated_at
    FROM tags
    WHERE user_id = $1
    ORDER BY created_at, id;
    "#;

const UPDATE_TAG_QUERY: &str = r#"
    UPDATE tags
    SET name = $1, updated_at = NOW()
    WHERE id = $2 AND user_id = $3
    "#;

const DELETE_TAG_QUERY: &str = "DELETE FROM tags WHERE id = $1 AND user_id = $2";

const GET_MEDIA_ITEMS_OF_TAG_QUERY: &str = r#"
    SELECT kind, title, poster_path, release_date, external_source, external_id, parent_id, season_number, episode_number
    FROM media_items
    INNER JOIN tags_items
        ON tags_items.media_item_id = media_items.id
    INNER JOIN tags
        ON tags.id = tags_items.tag_id
    WHERE tags_items.tag_id = $1 AND tags.user_id = $2
    ORDER BY tags_items.tagged_at, tags_items.media_item_id
    "#;

const TAG_MEDIA_ITEM_QUERY: &str = r#"
    INSERT INTO tags_items (tag_id, media_item_id)
    SELECT $1, $2
    FROM tags
    WHERE tags.id = $1 AND tags.user_id = $3
    "#;

const UNTAG_MEDIA_ITEM_QUERY: &str = r#"
    DELETE FROM tags_items
    USING tags, media_items
    WHERE tags_items.tag_id = $1
        AND tags_items.media_item_id = media_items.id
        AND media_items.kind = $2
        AND media_items.external_source = $3
        AND media_items.external_id = $4
        AND media_items.season_number IS NOT DISTINCT FROM $5
        AND media_items.episode_number IS NOT DISTINCT FROM $6
        AND tags.id = tags_items.tag_id
        AND tags.user_id = $7
    "#;

/**
 * Ensure that the given id results in an existing tag or return error
 */
pub async fn ensure_tag_id_exists(pool: &PgPool, tag_id: i64, user_id: i64) -> Result<(), AppError> {
    let result: Option<i64> = sqlx::query_scalar(ENSURE_TAG_ID_EXISTS_QUERY)
        .bind(tag_id)
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Ensuring tag id exists for user failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    match result {
        Some(_) => Ok(()),
        None => Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Tag does not exist."),
        )),
    }
}

/**
 * Ensure that the given name results in no existing tag or return error
 */
pub async fn ensure_tag_name_not_exists(pool: &PgPool, tag_name: String, user_id: i64) -> Result<(), AppError> {
    let result: Option<i64> = sqlx::query_scalar(ENSURE_TAG_NAME_NOT_EXISTS_QUERY)
        .bind(tag_name)
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Ensuring tag name not exists for user failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    match result {
        Some(_) => Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Tag with this name already exists."),
        )),
        None => Ok(()),
    }
}

/**
 * Get all tags of a user
 */
pub async fn get_tags(pool: &PgPool, user_id: i64) -> Result<Vec<Tag>, AppError> {
    sqlx::query_as(GET_TAGS_QUERY)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(Category::Db, "Getting tags for user failed with error: {:#?}", err);
            AppError::generic_500()
        })
}

/**
 * Create a tag and get its id
 */
pub async fn create_tag(pool: &PgPool, user_id: i64, tag_name: &str) -> Result<i64, AppError> {
    let tag_name = tag_name.trim();

    let tag_name_length = tag_name.chars().count();
    if !(tag_name_length > 0 && tag_name_length <= 30) {
        return Err(AppError {
            status_code: StatusCode::BAD_REQUEST,
            message: String::from("Tag name length has to be at least 1 and at most 30 characters"),
        });
    }

    ensure_tag_name_not_exists(pool, tag_name.to_string(), user_id).await?;

    sqlx::query_scalar(
        r#"
        INSERT INTO tags (name, user_id)
        VALUES ($1, $2)
        RETURNING id
        "#,
    )
    .bind(tag_name)
    .bind(user_id)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        if let sqlx::Error::Database(database_error) = &err
            && database_error.constraint() == Some("tags_user_id_name_key")
        {
            return AppError::new(StatusCode::BAD_REQUEST, String::from("Tag does already exist."));
        }

        error!(Category::Db, "Creating tag failed with error: {:#?}", err);
        AppError::generic_500()
    })
}

/**
 * Update a tag name
 */
pub async fn update_tag(pool: &PgPool, user_id: i64, tag_id: i64, tag_name: &str) -> Result<(), AppError> {
    let tag_name = tag_name.trim();

    let tag_name_length = tag_name.chars().count();
    if !(tag_name_length > 0 && tag_name_length <= 30) {
        return Err(AppError {
            status_code: StatusCode::BAD_REQUEST,
            message: String::from("Tag name length has to be at least 1 and at most 30 characters"),
        });
    }

    let result = sqlx::query(UPDATE_TAG_QUERY)
        .bind(tag_name)
        .bind(tag_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            if let sqlx::Error::Database(database_error) = &err
                && database_error.constraint() == Some("tags_user_id_name_key")
            {
                return AppError::new(StatusCode::BAD_REQUEST, String::from("Tag does already exist."));
            }

            error!(Category::Db, "Updating tag failed with error: {:#?}", err);
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Tag does not exist."),
        ));
    }

    Ok(())
}

/**
 * Delete a tag
 */
pub async fn delete_tag(pool: &PgPool, user_id: i64, tag_id: i64) -> Result<(), AppError> {
    let result = sqlx::query(DELETE_TAG_QUERY)
        .bind(tag_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            error!(Category::Db, "Deleting tag failed with error: {:#?}", err);
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Tag does not exist."),
        ));
    }

    Ok(())
}

/**
 * Get all media items with a tag
 */
pub async fn get_media_items_of_tag(pool: &PgPool, user_id: i64, tag_id: i64) -> Result<Vec<MediaItem>, AppError> {
    ensure_tag_id_exists(pool, tag_id, user_id).await?;

    sqlx::query_as(GET_MEDIA_ITEMS_OF_TAG_QUERY)
        .bind(tag_id)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Getting media items with tag failed with error: {:#?}", err
            );
            AppError::generic_500()
        })
}

/**
 * Add a media item to a tag
 */
pub async fn tag_media_item(
    pool: &PgPool,
    user_id: i64,
    tag_id: i64,
    media_item_tree: MediaItemTree,
) -> Result<(), AppError> {
    if !matches!(
        media_item_tree.kind.as_str(),
        "collection" | "movie" | "tv_series" | "tv_season" | "tv_episode"
    ) {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid media item kind."),
        ));
    }

    let media_item_id = media_items::upsert_media_item(pool, media_item_tree).await?;

    let result = sqlx::query(TAG_MEDIA_ITEM_QUERY)
        .bind(tag_id)
        .bind(media_item_id)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            if let sqlx::Error::Database(database_error) = &err
                && database_error.constraint() == Some("tags_items_pkey")
            {
                return AppError::new(
                    StatusCode::BAD_REQUEST,
                    String::from("Media item already has this tag."),
                );
            }

            error!(Category::Db, "Adding tag to media item failed with error: {:#?}", err);
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Tag does not exist."),
        ));
    }

    Ok(())
}

/**
 * Remove a tag from a media item
 */
pub async fn untag_media_item(
    pool: &PgPool,
    user_id: i64,
    tag_id: i64,
    request: UntagMediaItemRequest,
) -> Result<(), AppError> {
    let result = sqlx::query(UNTAG_MEDIA_ITEM_QUERY)
        .bind(tag_id)
        .bind(request.kind)
        .bind(request.external_source)
        .bind(request.external_id)
        .bind(request.season_number)
        .bind(request.episode_number)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Removing tag from media item failed with error: {:#?}", err
            );
            AppError::generic_500()
        })?;

    if result.rows_affected() == 0 {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            String::from("Media item does not have this tag."),
        ));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use sqlx::postgres::PgPoolOptions;

    use super::*;

    #[tokio::test]
    async fn rejects_unsupported_media_item_kind_before_database_access() {
        let pool = PgPoolOptions::new()
            .connect_lazy("postgres://test:test@localhost/test")
            .expect("test pool should be constructible");
        let media_item_tree = MediaItemTree {
            kind: String::from("unsupported"),
            title: None,
            poster_path: None,
            release_date: None,
            external_source: String::from("tmdb"),
            external_id: 1,
            parent: None,
            season_number: None,
            episode_number: None,
        };

        let error = tag_media_item(&pool, 1, 1, media_item_tree)
            .await
            .expect_err("unsupported media item kind should be rejected");

        assert_eq!(error.status_code, StatusCode::BAD_REQUEST);
        assert_eq!(error.message, "Invalid media item kind.");
    }

    #[test]
    fn every_tag_query_scopes_access_to_the_requesting_user() {
        let scoped_queries = [
            (ENSURE_TAG_ID_EXISTS_QUERY, "user_id = $"),
            (ENSURE_TAG_NAME_NOT_EXISTS_QUERY, "user_id = $"),
            (GET_TAGS_QUERY, "user_id = $"),
            (UPDATE_TAG_QUERY, "user_id = $"),
            (DELETE_TAG_QUERY, "user_id = $"),
            (GET_MEDIA_ITEMS_OF_TAG_QUERY, "tags.user_id = $"),
            (TAG_MEDIA_ITEM_QUERY, "tags.user_id = $"),
            (UNTAG_MEDIA_ITEM_QUERY, "tags.user_id = $"),
        ];

        for (query, user_scope) in scoped_queries {
            assert!(query.contains(user_scope), "query is missing user scope: {query}");
        }
    }
}
