use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

use crate::{error, integrations::tmdb::errors::TmdbError, logger::enums::category::Category};

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
            TmdbError::InvalidConfiguration { error }
            | TmdbError::Db { error }
            | TmdbError::Http { error }
            | TmdbError::Json { error } => {
                error!(Category::Tmdb, "{:#?}", error);
                AppError::generic_500()
            }
            TmdbError::Api { status, body } => {
                error!(Category::Tmdb, "{:#?}", body);
                AppError::new(status, body)
            }
        }
    }
}
