use axum::{
    Extension, Json,
    extract::{Path, Query},
};
use reqwest::StatusCode;

use crate::{
    app::{errors::AppError, state::AppState},
    features::custom_lists::{
        dto::{
            AddMediaItemToListRequest, CreateCustomListRequest, CreateCustomListResponse, CustomListResponse,
            DeleteMediaItemFromListRequest, UpdateCustomListRequest,
        },
        service,
    },
    persistence::models::{MediaItem, Session},
};

#[axum::debug_handler]
pub async fn get_custom_lists(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
) -> Result<(StatusCode, Json<Vec<CustomListResponse>>), AppError> {
    match service::get_custom_lists(&app_state.pool, session.user_id).await {
        Ok(lists) => Ok((
            StatusCode::OK,
            Json(lists.into_iter().map(CustomListResponse::from).collect()),
        )),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn create_custom_list(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Json(payload): Json<CreateCustomListRequest>,
) -> Result<(StatusCode, Json<CreateCustomListResponse>), AppError> {
    match service::create_custom_list(&app_state.pool, session.user_id, payload.name).await {
        Ok(list_id) => Ok((StatusCode::CREATED, Json(CreateCustomListResponse { id: list_id }))),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn update_custom_list(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(list_id): Path<i64>,
    Json(payload): Json<UpdateCustomListRequest>,
) -> Result<StatusCode, AppError> {
    match service::update_custom_list(&app_state.pool, session.user_id, list_id, payload.name).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn delete_custom_list(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(list_id): Path<i64>,
) -> Result<StatusCode, AppError> {
    match service::delete_custom_list(&app_state.pool, session.user_id, list_id).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn get_media_items_in_list(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(list_id): Path<i64>,
) -> Result<(StatusCode, Json<Vec<MediaItem>>), AppError> {
    match service::get_media_items_in_list(&app_state.pool, session.user_id, list_id).await {
        Ok(items) => Ok((StatusCode::OK, Json(items))),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn add_media_item_to_list(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(list_id): Path<i64>,
    Json(payload): Json<AddMediaItemToListRequest>,
) -> Result<(StatusCode, String), AppError> {
    match service::add_media_item_to_list(
        &app_state.pool,
        &app_state.tmdb,
        session.user_id,
        list_id,
        &payload.kind,
        &payload.external_source,
        payload.external_id,
    )
    .await
    {
        Ok(_) => Ok((
            StatusCode::CREATED,
            String::from("Added media item to list successfully"),
        )),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn delete_media_item_from_list(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(list_id): Path<i64>,
    Query(params): Query<DeleteMediaItemFromListRequest>,
) -> Result<StatusCode, AppError> {
    match service::delete_media_item_from_list(
        &app_state.pool,
        session.user_id,
        list_id,
        &params.kind,
        &params.external_source,
        params.external_id,
    )
    .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(err) => Err(err),
    }
}
