use crate::{
    app::{errors::AppError, state::AppState},
    features::tv_series::service,
    integrations::tmdb::{
        models::tv_series::TvSeriesDetails,
        resources::tv_series::dto::{
            DiscoverTvSeriesParams, DiscoverTvSeriesResponse, SearchTvSeriesParams, SearchTvSeriesResponse,
            SimilarTvSeriesParams, SimilarTvSeriesResponse, TrendingTvSeriesParams, TrendingTvSeriesResponse,
            TvSeriesAggregateCreditsParams, TvSeriesAggregateCreditsResponse, TvSeriesDetailsParams,
            TvSeriesRecommendationsParams, TvSeriesRecommendationsResponse, TvSeriesVideosParams,
            TvSeriesVideosResponse,
        },
    },
    persistence::models::Session,
};
use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

#[axum::debug_handler]
pub async fn get_series_details(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(series_id): Path<i64>,
    Query(params): Query<TvSeriesDetailsParams>,
) -> Result<(StatusCode, Json<TvSeriesDetails>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_series_details(app_state.tmdb, series_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn discover_tv_series(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<DiscoverTvSeriesParams>,
) -> Result<(StatusCode, Json<DiscoverTvSeriesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::discover_tv_series(app_state.tmdb, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_trending_tv_series(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(time_window): Path<String>,
    Query(params): Query<TrendingTvSeriesParams>,
) -> Result<(StatusCode, Json<TrendingTvSeriesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_trending_tv_series(app_state.tmdb, time_window, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn search_tv_series(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<SearchTvSeriesParams>,
) -> Result<(StatusCode, Json<SearchTvSeriesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::search_tv_series(app_state.tmdb, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_tv_series_recommendations(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(series_id): Path<i32>,
    Query(params): Query<TvSeriesRecommendationsParams>,
) -> Result<(StatusCode, Json<TvSeriesRecommendationsResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_tv_series_recommendations(app_state.tmdb, series_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_tv_similar_series(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(series_id): Path<i32>,
    Query(params): Query<SimilarTvSeriesParams>,
) -> Result<(StatusCode, Json<SimilarTvSeriesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_similar_tv_series(app_state.tmdb, series_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_tv_series_videos(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(series_id): Path<i32>,
    Query(params): Query<TvSeriesVideosParams>,
) -> Result<(StatusCode, Json<TvSeriesVideosResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_tv_series_videos(app_state.tmdb, series_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_tv_series_aggregate_credits(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(series_id): Path<i32>,
    Query(params): Query<TvSeriesAggregateCreditsParams>,
) -> Result<(StatusCode, Json<TvSeriesAggregateCreditsResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_tv_series_aggregate_credits(app_state.tmdb, series_id, params).await?),
    ))
}
