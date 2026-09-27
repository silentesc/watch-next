use serde::Deserialize;

#[derive(Deserialize)]
pub struct GetMediaItemListsRequest {
    pub kind: String,
    pub external_source: String,
    pub external_id: i32,
}
