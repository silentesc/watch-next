use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    features::{custom_lists::dto::MediaItemRequest, media_items},
    integrations::tmdb::TmdbApi,
    persistence::{
        models::{CustomList, MediaItem},
        table_utils::custom_lists,
    },
};

pub async fn get_custom_lists(pool: &PgPool, user_id: i64) -> Result<Vec<CustomList>, AppError> {
    custom_lists::get_custom_lists(pool, user_id).await
}

pub async fn create_custom_list(pool: &PgPool, user_id: i64, list_name: String) -> Result<i64, AppError> {
    custom_lists::create_custom_list(pool, user_id, &list_name).await
}

pub async fn update_custom_list(pool: &PgPool, user_id: i64, list_id: i64, list_name: String) -> Result<(), AppError> {
    custom_lists::update_custom_list(pool, user_id, list_id, &list_name).await
}

pub async fn delete_custom_list(pool: &PgPool, user_id: i64, list_id: i64) -> Result<(), AppError> {
    custom_lists::delete_custom_list(pool, user_id, list_id).await
}

pub async fn get_media_items_in_list(pool: &PgPool, user_id: i64, list_id: i64) -> Result<Vec<MediaItem>, AppError> {
    custom_lists::get_media_items_in_list(pool, user_id, list_id).await
}

pub async fn add_media_item_to_list(
    pool: &PgPool,
    tmdb: &TmdbApi,
    user_id: i64,
    list_id: i64,
    items: Vec<MediaItemRequest>,
) -> Result<(), AppError> {
    let mut resolved_items = Vec::with_capacity(items.len());
    for item in items {
        let media_item = match item.external_source.as_str() {
            "tmdb" => media_items::service::get_tmdb_media_item(pool, tmdb, &item.kind, item.external_id).await,
            _ => Err(AppError::new(
                StatusCode::BAD_REQUEST,
                String::from("Invalid external source."),
            )),
        }?;
        resolved_items.push(media_item);
    }

    custom_lists::add_media_items_to_list(pool, user_id, list_id, resolved_items).await
}

pub async fn delete_media_item_from_list(
    pool: &PgPool,
    user_id: i64,
    list_id: i64,
    items: Vec<MediaItemRequest>,
) -> Result<(), AppError> {
    custom_lists::delete_media_items_from_list(pool, user_id, list_id, items).await
}
