use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

use crate::persistence::models::CustomList;

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
