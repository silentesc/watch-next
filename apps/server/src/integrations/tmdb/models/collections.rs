use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CollectionOverview {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub id: Option<i64>,
    pub original_language: Option<String>,
    pub original_name: Option<String>,
    pub overview: Option<String>,
    pub poster_path: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CollectionDetail {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub id: Option<i64>,
    pub name: Option<String>,
    pub original_name: Option<String>,
    pub overview: Option<String>,
    pub poster_path: Option<String>,
    pub media_type: Option<String>,
    pub original_language: Option<String>,
    pub genre_ids: Option<Vec<i64>>,
    pub popularity: Option<f64>,
    pub release_date: Option<String>,
    pub video: Option<bool>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}
