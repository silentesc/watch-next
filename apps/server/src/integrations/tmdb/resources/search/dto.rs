use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::search::MultiSearchResult;

#[derive(Serialize, Deserialize)]
pub struct SearchMultiParams {
    pub query: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_adult: Option<bool>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<u32>,
}

#[derive(Serialize, Deserialize)]
pub struct SearchMultiResponse {
    pub page: i32,
    pub results: Vec<MultiSearchResult>,
    pub total_pages: i32,
    pub total_results: i32,
}
