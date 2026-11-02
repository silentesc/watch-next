use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::search::MultiSearchResult;

#[derive(Serialize, Deserialize)]
pub struct TrendingAllParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct TrendingAllResponse {
    pub page: i32,
    pub results: Vec<MultiSearchResult>,
    pub total_pages: i32,
    pub total_results: i64,
}
