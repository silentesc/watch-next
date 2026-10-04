use axum::{Extension, Json, extract::Query, http::StatusCode};

use crate::{
    app::{errors::AppError, state::AppState},
    features::genres::service,
    integrations::tmdb::resources::genres::dto::{
        GenreMovieListParams, GenreMovieListResponse, GenreTvListParams, GenreTvListResponse,
    },
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_movie_genres(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<GenreMovieListParams>,
) -> Result<(StatusCode, Json<GenreMovieListResponse>), AppError> {
    match service::get_movie_genres(app_state.tmdb, params).await {
        Ok(response) => Ok((StatusCode::OK, Json(response))),
        Err(app_error) => Err(app_error),
    }
}

#[axum::debug_handler]
pub async fn get_tv_genres(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<GenreTvListParams>,
) -> Result<(StatusCode, Json<GenreTvListResponse>), AppError> {
    match service::get_tv_genres(app_state.tmdb, params).await {
        Ok(response) => Ok((StatusCode::OK, Json(response))),
        Err(app_error) => Err(app_error),
    }
}
