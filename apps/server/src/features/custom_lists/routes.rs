use axum::{
    Router,
    routing::{delete, get, post, put},
};

use crate::{app::state::AppState, features::custom_lists::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/custom-lists", get(handlers::get_custom_lists))
        .route("/custom-lists", post(handlers::create_custom_list))
        .route("/custom-lists/{list_id}", put(handlers::update_custom_list))
        .route("/custom-lists/{list_id}", delete(handlers::delete_custom_list))
        .route("/custom-lists/{list_id}/items", get(handlers::get_media_items_in_list))
        .route("/custom-lists/{list_id}/items", post(handlers::add_media_item_to_list))
        .route(
            "/custom-lists/{list_id}/items",
            delete(handlers::delete_media_item_from_list),
        )
}
