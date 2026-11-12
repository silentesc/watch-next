use axum::{Extension, Json, extract::Query, http::StatusCode};

use crate::{
    app::{errors::AppError, state::AppState},
    features::search::service,
    integrations::tmdb::resources::search::dto::{SearchMultiParams, SearchMultiResponse},
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn search_multi(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<SearchMultiParams>,
) -> Result<(StatusCode, Json<SearchMultiResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::search_multi(app_state.tmdb, params).await?),
    ))
}
