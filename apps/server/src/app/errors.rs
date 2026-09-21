use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

use crate::integrations::tmdb::errors::TmdbError;

pub struct AppError {
    pub status_code: StatusCode,
    pub message: String,
}

impl AppError {
    pub fn new(status_code: StatusCode, message: String) -> Self {
        Self { status_code, message }
    }

    pub fn generic_500() -> Self {
        let status_code = StatusCode::INTERNAL_SERVER_ERROR;
        let message = String::from("An unexpected error occured");
        Self { status_code, message }
    }

    pub fn invalid_credentials() -> Self {
        let status_code = StatusCode::UNAUTHORIZED;
        let message = String::from("Invalid credentials");
        Self { status_code, message }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let body = Json(json!({ "error": self.message }));
        (self.status_code, body).into_response()
    }
}

impl From<TmdbError> for AppError {
    fn from(err: TmdbError) -> Self {
        match err {
            TmdbError::InvalidConfiguration { error: _ }
            | TmdbError::Db { error: _ }
            | TmdbError::Http { error: _ }
            | TmdbError::Json { error: _ } => AppError::generic_500(),
            TmdbError::Api { status, body } => AppError::new(status, body),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::AppError;
    use crate::integrations::tmdb::errors::TmdbError;
    use axum::http::StatusCode;

    #[test]
    fn maps_tmdb_api_errors_to_the_upstream_status_and_body() {
        let error = AppError::from(TmdbError::Api {
            status: StatusCode::NOT_FOUND,
            body: String::from("Movie not found"),
        });

        assert_eq!(error.status_code, StatusCode::NOT_FOUND);
        assert_eq!(error.message, "Movie not found");
    }

    #[test]
    fn hides_internal_tmdb_errors_from_clients() {
        let error = AppError::from(TmdbError::Json {
            error: String::from("invalid response"),
        });

        assert_eq!(error.status_code, StatusCode::INTERNAL_SERVER_ERROR);
        assert_eq!(error.message, "An unexpected error occured");
    }
}
