use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::{
    app::{errors::AppError, state::AppState},
    features::people::service,
    integrations::tmdb::{
        models::people::PersonDetails,
        resources::people::dto::{PersonCombinedCreditsParams, PersonCombinedCreditsResponse, PersonDetailsParams},
    },
    persistence::models::Session,
};

#[axum::debug_handler]
pub async fn get_person_details(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(person_id): Path<i32>,
    Query(params): Query<PersonDetailsParams>,
) -> Result<(StatusCode, Json<PersonDetails>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_details(app_state.tmdb, person_id, params).await?),
    ))
}

#[axum::debug_handler]
pub async fn get_person_combined_credits(
    Extension(app_state): Extension<AppState>,
    Extension(_): Extension<Session>,
    Path(person_id): Path<i32>,
    Query(params): Query<PersonCombinedCreditsParams>,
) -> Result<(StatusCode, Json<PersonCombinedCreditsResponse>), AppError> {
    Ok((
        StatusCode::OK,
        Json(service::get_combined_credits(app_state.tmdb, person_id, params).await?),
    ))
}
