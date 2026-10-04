use axum::{Router, routing::get};

use crate::{app::state::AppState, features::search::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route("/search/multi", get(handlers::search_multi))
}
