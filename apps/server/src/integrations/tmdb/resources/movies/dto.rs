use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::{
    common::{Cast, Crew, Video},
    movies::{MovieOverview, MovieReleaseDates},
};

#[derive(Serialize, Deserialize)]
pub struct SearchMoviesParams {
    pub query: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_adult: Option<bool>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub primary_release_year: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<u32>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub year: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct SearchMoviesResponse {
    pub page: i32,
    pub results: Vec<MovieOverview>,
    pub total_pages: i32,
    pub total_results: i32,
}

#[derive(Serialize, Deserialize)]
pub struct DiscoverMovieParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub certification: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "certification.gte")]
    pub certification_gte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "certification.lte")]
    pub certification_lte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub certification_country: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_adult: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_video: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub primary_release_year: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "primary_release_date.gte")]
    pub primary_release_date_gte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "primary_release_date.lte")]
    pub primary_release_date_lte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "release_date.gte")]
    pub release_date_gte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "release_date.lte")]
    pub release_date_lte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sort_by: Option<MovieSortBy>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "vote_average.gte")]
    pub vote_average_gte: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "vote_average.lte")]
    pub vote_average_lte: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "vote_count.gte")]
    pub vote_count_gte: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "vote_count.lte")]
    pub vote_count_lte: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub watch_region: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_cast: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_companies: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_crew: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_genres: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_keywords: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_origin_country: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_original_language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_people: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_release_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "with_runtime.gte")]
    pub with_runtime_gte: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "with_runtime.lte")]
    pub with_runtime_lte: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_watch_monetization_types: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_watch_providers: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub without_companies: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub without_genres: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub without_keywords: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub without_watch_providers: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub year: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub enum MovieSortBy {
    #[serde(rename = "original_title.asc")]
    OriginalTitleAsc,
    #[serde(rename = "original_title.desc")]
    OriginalTitleDesc,
    #[serde(rename = "popularity.asc")]
    PopularityAsc,
    #[serde(rename = "popularity.desc")]
    PopularityDesc,
    #[serde(rename = "revenue.asc")]
    RevenueAsc,
    #[serde(rename = "revenue.desc")]
    RevenueDesc,
    #[serde(rename = "primary_release_date.asc")]
    PrimaryReleaseDateAsc,
    #[serde(rename = "primary_release_date.desc")]
    PrimaryReleaseDateDesc,
    #[serde(rename = "title.asc")]
    TitleAsc,
    #[serde(rename = "title.desc")]
    TitleDesc,
    #[serde(rename = "vote_average.asc")]
    VoteAverageAsc,
    #[serde(rename = "vote_average.desc")]
    VoteAverageDesc,
    #[serde(rename = "vote_count.asc")]
    VoteCountAsc,
    #[serde(rename = "vote_count.desc")]
    VoteCountDesc,
}

#[derive(Serialize, Deserialize)]
pub struct DiscoverMovieResponse {
    pub page: i32,
    pub results: Vec<MovieOverview>,
    pub total_pages: i32,
    pub total_results: i32,
}

#[derive(Serialize, Deserialize)]
pub struct MovieCreditsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct MovieRecommendationsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct SimilarMoviesParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct MovieVideosParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct MovieCreditsResponse {
    pub id: i64,
    pub cast: Vec<Cast>,
    pub crew: Vec<Crew>,
}

#[derive(Deserialize, Serialize)]
pub struct MovieRecommendationsResponse {
    pub page: i32,
    pub results: Vec<MovieOverview>,
    pub total_pages: i32,
    pub total_results: i64,
}

#[derive(Deserialize, Serialize)]
pub struct SimilarMoviesResponse {
    pub page: i32,
    pub results: Vec<MovieOverview>,
    pub total_pages: i32,
    pub total_results: i64,
}

#[derive(Deserialize, Serialize)]
pub struct MovieReleaseDatesResponse {
    pub id: i64,
    pub results: Vec<MovieReleaseDates>,
}

#[derive(Deserialize, Serialize)]
pub struct MovieVideosResponse {
    pub id: i64,
    pub results: Vec<Video>,
}

#[derive(Serialize, Deserialize)]
pub struct TrendingMoviesParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct TrendingMoviesResponse {
    pub page: i32,
    pub results: Vec<MovieOverview>,
    pub total_pages: i32,
    pub total_results: i64,
}

#[derive(Serialize, Deserialize)]
pub struct MovieDetailsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub append_to_response: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}
