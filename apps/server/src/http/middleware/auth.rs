use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Response},
};
use axum_extra::extract::SignedCookieJar;
use uuid::Uuid;

use crate::{
    app::{constants, errors::AppError, state::AppState},
    error,
    logger::enums::category::Category,
    persistence::table_utils::sessions,
};

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

    // Parse session id to uuid
    let session_id = match Uuid::parse_str(&session_id) {
        Ok(session_id) => session_id,
        Err(err) => {
            error!(
                Category::Middleware,
                "Parsing session_id to uuid from string '{}' failed with error: {:#?}", session_id, err
            );
            return AppError::generic_500().into_response();
        }
    };

    // Get session
    let session = match sessions::get_session_by_id(&app_state.pool, session_id).await {
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
