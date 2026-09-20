use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{app::errors::AppError, error, logger::enums::category::Category};

/**
 * Create or update a media item and get its id
 */
pub async fn upsert_media_item(
    pool: &PgPool,
    kind: &str,
    external_source: &str,
    external_id: i64,
) -> Result<i64, AppError> {
    if !matches!(kind, "movie" | "tv_series") {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid media item kind."),
        ));
    }

    if !matches!(external_source, "tmdb") {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid media item external source."),
        ));
    }

    sqlx::query_scalar(
        r#"
        INSERT INTO media_items (kind, external_source, external_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (kind, external_source, external_id)
        DO UPDATE SET kind = EXCLUDED.kind
        RETURNING id
        "#,
    )
    .bind(kind)
    .bind(external_source)
    .bind(external_id)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        error!(Category::Db, "Upserting media item failed with error: {:#?}", err);
        AppError::generic_500()
    })
}
