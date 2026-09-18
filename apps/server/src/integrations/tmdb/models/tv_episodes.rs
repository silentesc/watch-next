use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::common::{Cast, Crew};

#[derive(Serialize, Deserialize)]
pub struct TvEpisodeOverview {
    pub air_date: Option<String>,
    pub episode_number: Option<i64>,
    pub id: Option<i64>,
    pub name: Option<String>,
    pub overview: Option<String>,
    pub production_code: Option<String>,
    pub runtime: Option<i64>,
    pub season_number: Option<i64>,
    pub show_id: Option<i64>,
    pub still_path: Option<String>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct TvEpisodeDetails {
    pub air_date: Option<String>,
    pub episode_number: Option<i64>,
    pub episode_type: Option<String>,
    pub id: Option<i64>,
    pub name: Option<String>,
    pub overview: Option<String>,
    pub production_code: Option<String>,
    pub runtime: Option<i64>,
    pub season_number: Option<i64>,
    pub show_id: Option<i64>,
    pub still_path: Option<String>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
    pub crew: Option<Vec<Crew>>,
    pub guest_stars: Option<Vec<Cast>>,
}
