use axum::{Router, routing::get};

use crate::{app::state::AppState, features::configuration::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route("/configuration/languages", get(handlers::get_languages))
}
