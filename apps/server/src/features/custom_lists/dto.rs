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
}

impl From<CustomList> for CustomListResponse {
    fn from(list: CustomList) -> Self {
        Self {
            id: list.id,
            name: list.name,
            created_at: list.created_at,
            updated_at: list.updated_at,
        }
    }
}

#[derive(Serialize)]
pub struct MediaItemResponse {
    pub kind: String,
    pub external_source: String,
    pub external_id: i64,
}

impl From<MediaItem> for MediaItemResponse {
    fn from(item: MediaItem) -> Self {
        Self {
            kind: item.kind,
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
    pub external_id: i64,
}

#[derive(Deserialize)]
pub struct DeleteMediaItemFromListRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i64,
}
