use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{app::errors::AppError, error, logger::enums::category::Category, persistence::models::MediaItem};

/**
 * Create or update a media item and get its id
 */
pub async fn upsert_media_item(pool: &PgPool, media_item: MediaItem) -> Result<i64, AppError> {
    if !matches!(media_item.kind.as_str(), "movie" | "tv_series") {
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
