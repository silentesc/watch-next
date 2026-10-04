use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::{
    app::{errors::AppError, state::AppState},
    features::movies::service,
    integrations::tmdb::{
        models::movies::MovieDetails,
        resources::movies::dto::{
            DiscoverMovieParams, DiscoverMovieResponse, MovieCreditsParams, MovieCreditsResponse, MovieDetailsParams,
            MovieRecommendationsParams, MovieRecommendationsResponse, MovieReleaseDatesResponse, MovieVideosParams,
            MovieVideosResponse, SearchMoviesParams, SearchMoviesResponse, SimilarMoviesParams, SimilarMoviesResponse,
            TrendingMoviesParams, TrendingMoviesResponse,
        },
    },
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_movie_details(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(movie_id): Path<i32>,
    Query(params): Query<MovieDetailsParams>,
) -> Result<(StatusCode, Json<MovieDetails>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_details(app_state.tmdb, movie_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn discover_movies(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<DiscoverMovieParams>,
) -> Result<(StatusCode, Json<DiscoverMovieResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::discover_movies(app_state.tmdb, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_trending_movies(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(time_window): Path<String>,
    Query(params): Query<TrendingMoviesParams>,
) -> Result<(StatusCode, Json<TrendingMoviesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_trending_movies(app_state.tmdb, time_window, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn search_movie(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<SearchMoviesParams>,
) -> Result<(StatusCode, Json<SearchMoviesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::search_movie(app_state.tmdb, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_movie_credits(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(movie_id): Path<i32>,
    Query(params): Query<MovieCreditsParams>,
) -> Result<(StatusCode, Json<MovieCreditsResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_credits(app_state.tmdb, movie_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_movie_recommendations(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(movie_id): Path<i32>,
    Query(params): Query<MovieRecommendationsParams>,
) -> Result<(StatusCode, Json<MovieRecommendationsResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_recommendations(app_state.tmdb, movie_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_movie_release_dates(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(movie_id): Path<i32>,
) -> Result<(StatusCode, Json<MovieReleaseDatesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_release_dates(app_state.tmdb, movie_id).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_similar_movies(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(movie_id): Path<i32>,
    Query(params): Query<SimilarMoviesParams>,
) -> Result<(StatusCode, Json<SimilarMoviesResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_similar(app_state.tmdb, movie_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_movie_videos(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(movie_id): Path<i32>,
    Query(params): Query<MovieVideosParams>,
) -> Result<(StatusCode, Json<MovieVideosResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_videos(app_state.tmdb, movie_id, params).await?),
    ))
}
