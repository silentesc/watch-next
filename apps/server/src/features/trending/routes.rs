use axum::{Router, routing::get};

use crate::{app::state::AppState, features::trending::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route("/trending/all/{time_window}", get(handlers::trending_all))
}
