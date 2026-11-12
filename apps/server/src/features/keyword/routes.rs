use axum::{Router, routing::get};

use crate::{app::state::AppState, features::keyword::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/keyword/{keyword_id}", get(handlers::get_keyword_details))
        .route("/search/keyword", get(handlers::search_keyword))
}
