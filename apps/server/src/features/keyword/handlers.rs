use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::{
    app::{errors::AppError, state::AppState},
    features::keyword::service,
    integrations::tmdb::{
        models::common::Keyword,
        resources::search::dto::{SearchKeywordParams, SearchKeywordResponse},
    },
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_keyword_details(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(keyword_id): Path<i32>,
) -> Result<(StatusCode, Json<Keyword>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_keyword_details(app_state.tmdb, keyword_id).await?),
    ))
}

#[axum::debug_handler]
pub async fn search_keyword(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<SearchKeywordParams>,
) -> Result<(StatusCode, Json<SearchKeywordResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::search_keyword(app_state.tmdb, params).await?),
    ))
}
