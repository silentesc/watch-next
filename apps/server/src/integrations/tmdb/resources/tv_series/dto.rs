use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::{
    common::Video,
    tv_series::{AggregateCast, AggregateCrew, TvSeriesOverview},
};

#[derive(Serialize, Deserialize)]
pub struct SearchTvSeriesParams {
    pub query: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_adult: Option<bool>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_air_date_year: Option<i32>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<u32>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub year: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct SearchTvSeriesResponse {
    pub page: i32,
    pub results: Vec<TvSeriesOverview>,
    pub total_pages: i32,
    pub total_results: i32,
}

#[derive(Serialize, Deserialize)]
pub struct DiscoverTvSeriesParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "air_date.gte")]
    pub air_date_gte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "air_date.lte")]
    pub air_date_lte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_air_date_year: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "first_air_date.gte")]
    pub first_air_date_gte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "first_air_date.lte")]
    pub first_air_date_lte: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_adult: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_null_first_air_dates: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub screened_theatrically: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sort_by: Option<TvSortBy>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timezone: Option<String>,
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
    pub with_companies: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_genres: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_keywords: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_networks: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_origin_country: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_original_language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "with_runtime.gte")]
    pub with_runtime_gte: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "with_runtime.lte")]
    pub with_runtime_lte: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub with_status: Option<String>,
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
    pub with_type: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub enum TvSortBy {
    #[serde(rename = "first_air_date.asc")]
    FirstAirDateAsc,
    #[serde(rename = "first_air_date.desc")]
    FirstAirDateDesc,
    #[serde(rename = "name.asc")]
    NameAsc,
    #[serde(rename = "name.desc")]
    NameDesc,
    #[serde(rename = "original_name.asc")]
    OriginalNameAsc,
    #[serde(rename = "original_name.desc")]
    OriginalNameDesc,
    #[serde(rename = "popularity.asc")]
    PopularityAsc,
    #[serde(rename = "popularity.desc")]
    PopularityDesc,
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
pub struct DiscoverTvSeriesResponse {
    pub page: i32,
    pub results: Vec<TvSeriesOverview>,
    pub total_pages: i32,
    pub total_results: i32,
}

#[derive(Serialize, Deserialize)]
pub struct TrendingTvSeriesParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct TrendingTvSeriesResponse {
    pub page: i32,
    pub results: Vec<TvSeriesOverview>,
    pub total_pages: i32,
    pub total_results: i64,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesRecommendationsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct SimilarTvSeriesParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesVideosParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_video_language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct TvSeriesRecommendationsResponse {
    pub page: i32,
    pub results: Vec<TvSeriesOverview>,
    pub total_pages: i32,
    pub total_results: i64,
}

#[derive(Deserialize, Serialize)]
pub struct SimilarTvSeriesResponse {
    pub page: i32,
    pub results: Vec<TvSeriesOverview>,
    pub total_pages: i32,
    pub total_results: i64,
}

#[derive(Deserialize, Serialize)]
pub struct TvSeriesVideosResponse {
    pub id: i64,
    pub results: Vec<Video>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesDetailsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub append_to_response: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesAggregateCreditsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct TvSeriesAggregateCreditsResponse {
    pub id: i64,
    pub cast: Vec<AggregateCast>,
    pub crew: Vec<AggregateCrew>,
}
