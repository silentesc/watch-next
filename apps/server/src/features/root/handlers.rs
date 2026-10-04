use axum::http::StatusCode;

#[axum::debug_handler]
pub async fn root() -> (StatusCode, &'static str) {
    (StatusCode::OK, "Up and running!")
}
