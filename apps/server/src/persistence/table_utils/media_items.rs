use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    error,
    logger::enums::category::Category,
    persistence::models::{CustomList, MediaItem},
};

const GET_MEDIA_ITEM_CUSTOM_LISTS: &str = r#"
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
    FROM media_items AS mi
    INNER JOIN custom_list_items AS cli ON cli.media_item_id = mi.id
    INNER JOIN custom_lists AS cl ON cl.id = cli.list_id
    WHERE cl.user_id = $1
        AND mi.kind = $2
        AND mi.external_source = $3
        AND mi.external_id = $4
    ORDER BY cl.created_at, cl.id
    "#;

pub async fn get_media_item_custom_lists(
    pool: &PgPool,
    user_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i32,
) -> Result<Vec<CustomList>, AppError> {
    sqlx::query_as(GET_MEDIA_ITEM_CUSTOM_LISTS)
        .bind(user_id)
        .bind(kind)
        .bind(external_source)
        .bind(external_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Getting custom lists of media item failed with error: {:#?}", err
            );
            AppError::generic_500()
        })
}

/**
 * Create or update a media item and get its id
 */
pub async fn upsert_media_item(pool: &PgPool, media_item: MediaItem) -> Result<i64, AppError> {
    if !matches!(media_item.kind.as_str(), "collection" | "movie" | "tv_series") {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid media item kind."),
        ));
    }

    if !matches!(media_item.external_source.as_str(), "tmdb") {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid media item external source."),
        ));
    }

    sqlx::query_scalar(
        r#"
        INSERT INTO media_items (kind, title, poster_path, release_date, external_source, external_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (kind, external_source, external_id)
        DO UPDATE SET
            title = EXCLUDED.title,
            poster_path = EXCLUDED.poster_path,
            release_date = EXCLUDED.release_date
        RETURNING id
        "#,
    )
    .bind(media_item.kind)
    .bind(media_item.title)
    .bind(media_item.poster_path)
    .bind(media_item.release_date)
    .bind(media_item.external_source)
    .bind(media_item.external_id)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        error!(Category::Db, "Upserting media item failed with error: {:#?}", err);
        AppError::generic_500()
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_media_item_query_scopes_access_to_the_requesting_user() {
        let scoped_queries = [(GET_MEDIA_ITEM_CUSTOM_LISTS, "user_id = $")];

        for (query, user_scope) in scoped_queries {
            assert!(query.contains(user_scope), "query is missing user scope: {query}");
        }
    }
}
