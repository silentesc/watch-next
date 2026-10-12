use sqlx::PgPool;

use crate::{
    app::errors::AppError, features::media_items::dto::GetMediaItemTagsRequest, persistence::{models::{CustomList, Tag}, table_utils::media_items},
};

pub async fn get_media_item_custom_lists(
    pool: &PgPool,
    user_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i32,
) -> Result<Vec<CustomList>, AppError> {
    media_items::get_media_item_custom_lists(pool, user_id, kind, external_source, external_id).await
}

pub async fn get_media_item_tags(
    pool: &PgPool,
    user_id: i64,
    params: GetMediaItemTagsRequest
) -> Result<Vec<Tag>, AppError> {
    media_items::get_media_item_tags(pool, user_id, params).await
}
