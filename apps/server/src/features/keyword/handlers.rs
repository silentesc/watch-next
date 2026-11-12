use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::{
    app::{errors::AppError, state::AppState},
    features::keyword::service,
    integrations::tmdb::models::common::Keyword,
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
