use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::tv_episodes::TvEpisodeDetails;

#[derive(Serialize, Deserialize)]
pub struct TvSeasonOverview {
    pub air_date: Option<String>,
    pub episode_count: Option<i64>,
    pub id: Option<i64>,
    pub name: Option<String>,
    pub overview: Option<String>,
    pub poster_path: Option<String>,
    pub season_number: Option<i64>,
    pub vote_average: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeasonDetails {
    #[serde(rename = "_id")]
    pub id_string: Option<String>,
    pub air_date: Option<String>,
    pub episodes: Option<Vec<TvEpisodeDetails>>,
    pub name: Option<String>,
    pub networks: Option<Vec<TvSeasonNetwork>>,
    pub overview: Option<String>,
    pub id: Option<i64>,
    pub poster_path: Option<String>,
    pub season_number: Option<i64>,
    pub vote_average: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeasonNetwork {
    pub id: Option<i64>,
    pub logo_path: Option<String>,
    pub name: Option<String>,
    pub origin_country: Option<String>,
}
