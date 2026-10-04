use axum::{Router, routing::get};

use crate::{app::state::AppState, features::tv_seasons::handlers};

pub fn router() -> Router<AppState> {
    Router::new().route(
        "/tv/{series_id}/season/{season_number}",
        get(handlers::get_season_details),
    )
}
