use axum::{Router, routing::get};

use crate::{app::state::AppState, features::tv_series::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/discover/tv", get(handlers::discover_tv_series))
        .route("/trending/tv/{time_window}", get(handlers::get_trending_tv_series))
        .route("/search/tv", get(handlers::search_tv_series))
        .route("/tv/{series_id}", get(handlers::get_series_details))
        .route(
            "/tv/{series_id}/aggregate_credits",
            get(handlers::get_tv_series_aggregate_credits),
        )
        .route("/tv/{series_id}/videos", get(handlers::get_tv_series_videos))
        .route(
            "/tv/{series_id}/recommendations",
            get(handlers::get_tv_series_recommendations),
        )
        .route("/tv/{series_id}/similar", get(handlers::get_tv_similar_series))
}
