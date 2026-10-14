use axum::{
    Extension, Json,
    extract::{Path, Query},
};
use reqwest::StatusCode;

use crate::{
    app::{errors::AppError, state::AppState},
    features::tags::{
        dto::{
            CreateTagRequest, CreateTagResponse, TagMediaItemRequest, TagResponse, UntagMediaItemRequest,
            UpdateTagRequest,
        },
        service,
    },
    persistence::models::{MediaItemTree, Session},
};

#[axum::debug_handler]
pub async fn get_tags(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
) -> Result<(StatusCode, Json<Vec<TagResponse>>), AppError> {
    match service::get_tags(&app_state.pool, session.user_id).await {
        Ok(tags) => Ok((StatusCode::OK, Json(tags.into_iter().map(TagResponse::from).collect()))),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn create_tag(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Json(payload): Json<CreateTagRequest>,
) -> Result<(StatusCode, Json<CreateTagResponse>), AppError> {
    match service::create_tag(&app_state.pool, session.user_id, payload.name).await {
        Ok(tag_id) => Ok((StatusCode::CREATED, Json(CreateTagResponse { id: tag_id }))),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn update_tag(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(tag_id): Path<i64>,
    Json(payload): Json<UpdateTagRequest>,
) -> Result<StatusCode, AppError> {
    match service::update_tag(&app_state.pool, session.user_id, tag_id, payload.name).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn delete_tag(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(tag_id): Path<i64>,
) -> Result<StatusCode, AppError> {
    match service::delete_tag(&app_state.pool, session.user_id, tag_id).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn get_media_items_of_tag(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(tag_id): Path<i64>,
) -> Result<(StatusCode, Json<Vec<MediaItemTree>>), AppError> {
    match service::get_media_items_of_tag(&app_state.pool, session.user_id, tag_id).await {
        Ok(items) => Ok((StatusCode::OK, Json(items))),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn tag_media_item(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(tag_id): Path<i64>,
    Json(payload): Json<TagMediaItemRequest>,
) -> Result<(StatusCode, String), AppError> {
    match service::tag_media_item(&app_state.pool, &app_state.tmdb, session.user_id, tag_id, payload).await {
        Ok(_) => Ok((StatusCode::CREATED, String::from("Tagged media item successfully"))),
        Err(err) => Err(err),
    }
}

#[axum::debug_handler]
pub async fn untag_media_item(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Path(tag_id): Path<i64>,
    Query(params): Query<UntagMediaItemRequest>,
) -> Result<StatusCode, AppError> {
    match service::untag_media_item(&app_state.pool, session.user_id, tag_id, params).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(err) => Err(err),
    }
}
