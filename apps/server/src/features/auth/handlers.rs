use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::SignedCookieJar;

use crate::{
    app::{errors::AppError, state::AppState},
    features::auth::dto::{LoginRequest, RegisterRequest},
};

#[axum::debug_handler]
pub async fn register(
    State(app_state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<(StatusCode, String), AppError> {
    if !app_state.allow_registration {
        return Err(AppError::new(
            StatusCode::FORBIDDEN,
            String::from("Registration is disabled"),
        ));
    }

    match crate::features::auth::service::register(&app_state.pool, payload.username, payload.password).await {
        Ok(_) => Ok((StatusCode::CREATED, String::from("Registered successfully"))),
        Err(app_error) => Err(app_error),
    }
}

#[axum::debug_handler]
pub async fn login(
    State(app_state): State<AppState>,
    jar: SignedCookieJar,
    Json(payload): Json<LoginRequest>,
) -> Result<(StatusCode, SignedCookieJar), AppError> {
    match crate::features::auth::service::login(&app_state.pool, jar, payload.username, payload.password).await {
        Ok(signed_cookie_jar) => Ok((StatusCode::NO_CONTENT, signed_cookie_jar)),
        Err(app_error) => Err(app_error),
    }
}

#[axum::debug_handler]
pub async fn logout(
    State(app_state): State<AppState>,
    jar: SignedCookieJar,
) -> Result<(StatusCode, SignedCookieJar), AppError> {
    match crate::features::auth::service::logout(&app_state.pool, jar).await {
        Ok(updated_jar) => Ok((StatusCode::OK, updated_jar)),
        Err(app_error) => Err(app_error),
    }
}
