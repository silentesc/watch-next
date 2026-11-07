use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    features::{
        media_items,
        tags::dto::{TagMediaItemRequest, UntagMediaItemRequest},
    },
    integrations::tmdb::TmdbApi,
    persistence::{
        models::{MediaItem, Tag},
        table_utils::tags,
    },
};

pub async fn get_tags(pool: &PgPool, user_id: i64) -> Result<Vec<Tag>, AppError> {
    tags::get_tags(pool, user_id).await
}

pub async fn create_tag(pool: &PgPool, user_id: i64, tag_name: String) -> Result<i64, AppError> {
    tags::create_tag(pool, user_id, &tag_name).await
}

pub async fn update_tag(pool: &PgPool, user_id: i64, tag_id: i64, tag_name: String) -> Result<(), AppError> {
    tags::update_tag(pool, user_id, tag_id, &tag_name).await
}

pub async fn delete_tag(pool: &PgPool, user_id: i64, tag_id: i64) -> Result<(), AppError> {
    tags::delete_tag(pool, user_id, tag_id).await
}

pub async fn get_media_items_of_tag(pool: &PgPool, user_id: i64, tag_id: i64) -> Result<Vec<MediaItem>, AppError> {
    tags::get_media_items_of_tag(pool, user_id, tag_id).await
}

pub async fn tag_media_item(
    pool: &PgPool,
    tmdb: &TmdbApi,
    user_id: i64,
    tag_id: i64,
    request: TagMediaItemRequest,
) -> Result<(), AppError> {
    tags::ensure_tag_id_exists(pool, tag_id, user_id).await?;

    if request.external_source != "tmdb" {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid external source."),
        ));
    }

    let media_item = media_items::service::get_tmdb_media_item(tmdb, &request.kind, request.external_id).await?;

    tags::tag_media_item(pool, user_id, tag_id, media_item).await
}

pub async fn untag_media_item(
    pool: &PgPool,
    user_id: i64,
    tag_id: i64,
    request: UntagMediaItemRequest,
) -> Result<(), AppError> {
    tags::untag_media_item(pool, user_id, tag_id, request).await
}
