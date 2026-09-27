use axum::{Router, routing::get};

use crate::{app::state::AppState, features::media_items::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route("/media-items/custom-lists", get(handlers::get_media_item_custom_lists))
}
