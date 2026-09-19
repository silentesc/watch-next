use axum::{Router, routing::get};

use crate::{app::state::AppState, features::root::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route("/", get(handlers::root))
}
