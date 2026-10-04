use axum::{Router, routing::get};

use crate::{app::state::AppState, features::people::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/person/{person_id}", get(handlers::get_person_details))
        .route(
            "/person/{person_id}/combined_credits",
            get(handlers::get_person_combined_credits),
        )
}
