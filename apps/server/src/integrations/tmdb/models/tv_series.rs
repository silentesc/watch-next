use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::{
    common::{Country, Genre, Language},
    tv_episodes::TvEpisodeOverview,
    tv_season::TvSeasonOverview,
};

#[derive(Serialize, Deserialize)]
pub struct TvSeriesOverview {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub media_type: Option<String>,
    pub poster_path: Option<String>,
    pub genre_ids: Option<Vec<i64>>,
    pub id: Option<i64>,
    pub original_language: Option<String>,
    pub original_name: Option<String>,
    pub name: Option<String>,
    pub overview: Option<String>,
    pub popularity: Option<f64>,
    pub first_air_date: Option<String>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
    pub origin_country: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesDetails {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub created_by: Option<Vec<TvSeriesCreator>>,
    pub episode_run_time: Option<Vec<i64>>,
    pub first_air_date: Option<String>,
    pub genres: Option<Vec<Genre>>,
    pub homepage: Option<String>,
    pub id: Option<i64>,
    pub in_production: Option<bool>,
    pub languages: Option<Vec<String>>,
    pub last_air_date: Option<String>,
    pub last_episode_to_air: Option<TvEpisodeOverview>,
    pub name: Option<String>,
    pub networks: Option<Vec<TvSeriesNetwork>>,
    pub next_episode_to_air: Option<TvEpisodeOverview>,
    pub number_of_episodes: Option<i64>,
    pub number_of_seasons: Option<i64>,
    pub origin_country: Option<Vec<String>>,
    pub original_language: Option<String>,
    pub original_name: Option<String>,
    pub overview: Option<String>,
    pub popularity: Option<f64>,
    pub poster_path: Option<String>,
    pub production_companies: Option<Vec<TvSeriesProductionCompany>>,
    pub production_countries: Option<Vec<Country>>,
    pub seasons: Option<Vec<TvSeasonOverview>>,
    pub spoken_languages: Option<Vec<Language>>,
    pub status: Option<String>,
    pub tagline: Option<String>,
    #[serde(rename = "type")]
    pub series_type: Option<String>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesCreator {
    pub id: Option<i64>,
    pub credit_id: Option<String>,
    pub name: Option<String>,
    pub gender: Option<i32>,
    pub profile_path: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesNetwork {
    pub id: Option<i64>,
    pub logo_path: Option<String>,
    pub name: Option<String>,
    pub origin_country: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesProductionCompany {
    pub id: Option<i64>,
    pub logo_path: Option<String>,
    pub name: Option<String>,
    pub origin_country: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct AggregateCast {
    pub adult: Option<bool>,
    pub gender: Option<i32>,
    pub id: Option<i64>,
    pub known_for_department: Option<String>,
    pub name: Option<String>,
    pub original_name: Option<String>,
    pub popularity: Option<f64>,
    pub profile_path: Option<String>,
    pub roles: Option<Vec<AggregateCastRole>>,
    pub total_episode_count: Option<i64>,
    pub order: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct AggregateCastRole {
    pub credit_id: Option<String>,
    pub character: Option<String>,
    pub episode_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct AggregateCrew {
    pub adult: Option<bool>,
    pub gender: Option<i32>,
    pub id: Option<i64>,
    pub known_for_department: Option<String>,
    pub name: Option<String>,
    pub original_name: Option<String>,
    pub popularity: Option<f64>,
    pub profile_path: Option<String>,
    pub jobs: Option<Vec<AggregateCrewJob>>,
    pub department: Option<String>,
    pub total_episode_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct AggregateCrewJob {
    pub credit_id: Option<String>,
    pub job: Option<String>,
    pub episode_count: Option<i64>,
}
