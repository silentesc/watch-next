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
    let mut media_items_to_tag = Vec::with_capacity(request.items.len());
    for item in request.items {
        let media_item = match item.external_source.as_str() {
            "tmdb" => media_items::service::get_tmdb_media_item(pool, tmdb, &item.kind, item.external_id).await,
            _ => Err(AppError::new(
                StatusCode::BAD_REQUEST,
                String::from("Invalid external source."),
            )),
        }?;
        media_items_to_tag.push(media_item);
    }

    tags::tag_media_items(pool, user_id, tag_id, media_items_to_tag).await
}

pub async fn untag_media_item(
    pool: &PgPool,
    user_id: i64,
    tag_id: i64,
    request: UntagMediaItemRequest,
) -> Result<(), AppError> {
    tags::untag_media_item(pool, user_id, tag_id, request).await
}
