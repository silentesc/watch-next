use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::{
    app::{errors::AppError, state::AppState},
    features::trending::service,
    integrations::tmdb::resources::trending::dto::{TrendingAllParams, TrendingAllResponse},
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn trending_all(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(time_window): Path<String>,
    Query(params): Query<TrendingAllParams>,
) -> Result<(StatusCode, Json<TrendingAllResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::trending_all(app_state.tmdb, time_window, params).await?),
    ))
}
