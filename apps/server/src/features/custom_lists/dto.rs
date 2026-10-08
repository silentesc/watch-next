use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

use crate::persistence::models::{CustomList, MediaItem};

#[derive(Serialize)]
pub struct CustomListResponse {
    pub id: i64,
    pub name: String,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub updated_at: OffsetDateTime,
    pub preview_posters: Vec<String>,
}

impl From<CustomList> for CustomListResponse {
    fn from(list: CustomList) -> Self {
        Self {
            id: list.id,
            name: list.name,
            created_at: list.created_at,
            updated_at: list.updated_at,
            preview_posters: list.preview_posters,
        }
    }
}

#[derive(Serialize)]
pub struct MediaItemResponse {
    pub kind: String,
    pub title: Option<String>,
    pub poster_path: Option<String>,
    pub release_date: Option<String>,
    pub external_source: String,
    pub external_id: i32,
}

impl From<MediaItem> for MediaItemResponse {
    fn from(item: MediaItem) -> Self {
        Self {
            kind: item.kind,
            title: item.title,
            poster_path: item.poster_path,
            release_date: item.release_date,
            external_source: item.external_source,
            external_id: item.external_id,
        }
    }
}

#[derive(Deserialize)]
pub struct CreateCustomListRequest {
    pub name: String,
}

#[derive(Serialize)]
pub struct CreateCustomListResponse {
    pub id: i64,
}

#[derive(Deserialize)]
pub struct UpdateCustomListRequest {
    pub name: String,
}

#[derive(Deserialize)]
pub struct AddMediaItemToListRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
}

#[derive(Deserialize)]
pub struct DeleteMediaItemFromListRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
}
