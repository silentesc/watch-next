use axum::{Router, routing::get};

use crate::{app::state::AppState, features::collections::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/search/collection", get(handlers::search_collection))
        .route("/collection/{collection_id}", get(handlers::get_collection_details))
}
