use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

use crate::persistence::models::Tag;

#[derive(Serialize)]
pub struct TagResponse {
    pub id: i64,
    pub name: String,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339")]
    pub updated_at: OffsetDateTime,
}

impl From<Tag> for TagResponse {
    fn from(tag: Tag) -> Self {
        Self {
            id: tag.id,
            name: tag.name,
            created_at: tag.created_at,
            updated_at: tag.updated_at,
        }
    }
}

#[derive(Deserialize)]
pub struct CreateTagRequest {
    pub name: String,
}

#[derive(Serialize)]
pub struct CreateTagResponse {
    pub id: i64,
}

#[derive(Deserialize)]
pub struct UpdateTagRequest {
    pub name: String,
}

#[derive(Deserialize)]
pub struct TagMediaItemRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
    pub season_number: Option<i32>,
    pub episode_number: Option<i32>,
}

#[derive(Deserialize)]
pub struct UntagMediaItemRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
    pub season_number: Option<i32>,
    pub episode_number: Option<i32>,
}
