use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::{
    app::{errors::AppError, state::AppState},
    integrations::tmdb::{models::tv_season::TvSeasonDetails, resources::tv_seasons::dto::TvSeasonDetailsParams},
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_season_details(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path((series_id, season_number)): Path<(i32, i32)>,
    Query(params): Query<TvSeasonDetailsParams>,
) -> Result<(StatusCode, Json<TvSeasonDetails>), AppError> {
    match crate::features::tv_seasons::service::get_season_details(app_state.tmdb, series_id, season_number, params)
        .await
    {
        Ok(response) => Ok((StatusCode::OK, Json(response))),
        Err(app_error) => Err(app_error),
    }
}
