use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::common::Genre;

#[derive(Serialize, Deserialize)]
pub struct GenreMovieListParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct GenreTvListParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct GenreMovieListResponse {
    pub genres: Vec<Genre>,
}

#[derive(Serialize, Deserialize)]
pub struct GenreTvListResponse {
    pub genres: Vec<Genre>,
}
