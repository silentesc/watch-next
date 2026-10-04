use axum::{Router, routing::get};

use crate::{app::state::AppState, features::me::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route("/me", get(handlers::me))
}
