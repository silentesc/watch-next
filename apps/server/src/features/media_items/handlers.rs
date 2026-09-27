use axum::{Extension, Json, extract::Query};
use reqwest::StatusCode;

use crate::{
    app::{errors::AppError, state::AppState},
    features::{
        custom_lists::dto::CustomListResponse,
        media_items::{dto::GetMediaItemListsRequest, service},
    },
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_media_item_custom_lists(
    Extension(app_state): Extension<AppState>,
    Extension(session): Extension<Session>,
    Query(params): Query<GetMediaItemListsRequest>,
) -> Result<(StatusCode, Json<Vec<CustomListResponse>>), AppError> {
    match service::get_media_item_custom_lists(
        &app_state.pool,
        session.user_id,
        &params.kind,
        &params.external_source,
        params.external_id,
    )
    .await
    {
        Ok(lists) => Ok((
            StatusCode::OK,
            Json(lists.into_iter().map(CustomListResponse::from).collect()),
        )),
        Err(err) => Err(err),
    }
}
