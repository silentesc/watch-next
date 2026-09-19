use crate::{
    app::{constants, errors::AppError, state::AppState},
    persistence::table_utils::sessions,
};
use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Response},
};
use axum_extra::extract::SignedCookieJar;

pub async fn validate_session(
    State(app_state): State<AppState>,
    jar: SignedCookieJar,
    mut request: Request,
    next: Next,
) -> Response {
    // Get session id
    let session_id = match jar.get(constants::SESSION_ID_COOKIE_NAME) {
        Some(cookie) => cookie.value().to_string(),
        None => return AppError::invalid_credentials().into_response(),
    };

    // Get session
    let session = match sessions::get_session_by_id(&app_state.pool, &session_id).await {
        Ok(session) => session,
        Err(app_error) => return app_error.into_response(),
    };
    let session = match session {
        Some(session) => session,
        None => return AppError::invalid_credentials().into_response(),
    };

    // Add session
    request.extensions_mut().insert(app_state);
    request.extensions_mut().insert(session);

    // Allow request
    next.run(request).await
}
