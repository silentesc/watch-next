use serde::Deserialize;

#[derive(Deserialize)]
pub struct GetMediaItemListsRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
}

#[derive(Deserialize)]
pub struct GetMediaItemTagsRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
    pub season_number: Option<i32>,
    pub episode_number: Option<i32>,
}
