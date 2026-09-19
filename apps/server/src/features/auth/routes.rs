use axum::{Router, routing::post};

use crate::{app::state::AppState, features::auth::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/auth/register", post(handlers::register))
        .route("/auth/login", post(handlers::login))
        .route("/auth/logout", post(handlers::logout))
}
