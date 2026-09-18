use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::{
    collections::CollectionOverview,
    common::{Country, Genre, Language, ReleaseDate},
};

#[derive(Serialize, Deserialize)]
pub struct MovieOverview {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub media_type: Option<String>,
    pub genre_ids: Option<Vec<i64>>,
    pub id: Option<i64>,
    pub original_language: Option<String>,
    pub original_title: Option<String>,
    pub overview: Option<String>,
    pub popularity: Option<f64>,
    pub poster_path: Option<String>,
    pub release_date: Option<String>,
    pub title: Option<String>,
    pub video: Option<bool>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct MovieReleaseDates {
    pub iso_3166_1: Option<String>,
    pub release_dates: Option<Vec<ReleaseDate>>,
}

#[derive(Serialize, Deserialize)]
pub struct MovieDetails {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub belongs_to_collection: Option<CollectionOverview>,
    pub budget: Option<i64>,
    pub genres: Option<Vec<Genre>>,
    pub homepage: Option<String>,
    pub id: Option<i64>,
    pub imdb_id: Option<String>,
    pub origin_country: Option<Vec<String>>,
    pub original_language: Option<String>,
    pub original_title: Option<String>,
    pub overview: Option<String>,
    pub popularity: Option<f64>,
    pub poster_path: Option<String>,
    pub production_companies: Option<Vec<MovieProductionCompany>>,
    pub production_countries: Option<Vec<Country>>,
    pub release_date: Option<String>,
    pub revenue: Option<i64>,
    pub runtime: Option<i64>,
    pub spoken_languages: Option<Vec<Language>>,
    pub status: Option<String>,
    pub tagline: Option<String>,
    pub title: Option<String>,
    pub video: Option<bool>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct MovieProductionCompany {
    pub id: Option<i64>,
    pub logo_path: Option<String>,
    pub name: Option<String>,
    pub origin_country: Option<String>,
}
