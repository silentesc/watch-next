use axum::{Extension, Json, http::StatusCode};

use crate::{
    app::{errors::AppError, state::AppState},
    integrations::tmdb::models::common::Language,
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_languages(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
) -> Result<(StatusCode, Json<Vec<Language>>), AppError> {
    match crate::features::configuration::service::get_languages(app_state.tmdb).await {
        Ok(response) => Ok((StatusCode::OK, Json(response))),
        Err(app_error) => Err(app_error),
    }
}
