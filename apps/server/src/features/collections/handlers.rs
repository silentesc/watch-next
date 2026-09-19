use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::{
    app::{errors::AppError, state::AppState},
    integrations::tmdb::resources::collections::dto::{
        CollectionDetailsParams, CollectionDetailsResponse, SearchCollectionsParams, SearchCollectionsResponse,
    },
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_collection_details(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(collection_id): Path<i32>,
    Query(params): Query<CollectionDetailsParams>,
) -> Result<(StatusCode, Json<CollectionDetailsResponse>), AppError> {
    match crate::features::collections::service::get_collection_details(app_state.tmdb, collection_id, params).await {
        Ok(response) => Ok((StatusCode::OK, Json(response))),
        Err(app_error) => Err(app_error),
    }
}

#[axum::debug_handler]
pub async fn search_collection(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Query(params): Query<SearchCollectionsParams>,
) -> Result<(StatusCode, Json<SearchCollectionsResponse>), AppError> {
    match crate::features::collections::service::search_collection(app_state.tmdb, params).await {
        Ok(response) => Ok((StatusCode::OK, Json(response))),
        Err(app_error) => Err(app_error),
    }
}
