use axum::http::StatusCode;

#[derive(Debug)]
pub enum TmdbError {
    InvalidConfiguration { error: String },
    Db { error: String },
    Http { error: String },
    Json { error: String },
    Api { status: StatusCode, body: String },
}
