use axum::{
    Router,
    routing::{delete, get, post, put},
};

use crate::{app::state::AppState, features::tags::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/tags", get(handlers::get_tags))
        .route("/tags", post(handlers::create_tag))
        .route("/tags/{tag_id}", put(handlers::update_tag))
        .route("/tags/{tag_id}", delete(handlers::delete_tag))
        .route("/tags/{tag_id}/items", get(handlers::get_media_items_of_tag))
        .route("/tags/{tag_id}/items", post(handlers::tag_media_item))
        .route("/tags/{tag_id}/items", delete(handlers::untag_media_item))
}
