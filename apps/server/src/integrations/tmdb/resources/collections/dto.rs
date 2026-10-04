use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::collections::{CollectionDetail, CollectionOverview};

#[derive(Serialize, Deserialize)]
pub struct SearchCollectionsParams {
    pub query: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_adult: Option<bool>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<u32>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct SearchCollectionsResponse {
    pub page: i32,
    pub results: Vec<CollectionOverview>,
    pub total_pages: i32,
    pub total_results: i32,
}

#[derive(Serialize, Deserialize)]
pub struct CollectionDetailsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CollectionDetailsResponse {
    pub id: Option<i64>,
    pub name: Option<String>,
    pub original_language: Option<String>,
    pub original_name: Option<String>,
    pub overview: Option<String>,
    pub poster_path: Option<String>,
    pub backdrop_path: Option<String>,
    pub parts: Option<Vec<CollectionDetail>>,
}
