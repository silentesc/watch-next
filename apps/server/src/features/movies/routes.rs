use axum::{Router, routing::get};

use crate::{app::state::AppState, features::movies::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/discover/movie", get(handlers::discover_movies))
        .route("/trending/movie/{time_window}", get(handlers::get_trending_movies))
        .route("/search/movie", get(handlers::search_movie))
        .route("/movie/{movie_id}", get(handlers::get_movie_details))
        .route(
            "/movie/{movie_id}/release_dates",
            get(handlers::get_movie_release_dates),
        )
        .route("/movie/{movie_id}/credits", get(handlers::get_movie_credits))
        .route("/movie/{movie_id}/videos", get(handlers::get_movie_videos))
        .route(
            "/movie/{movie_id}/recommendations",
            get(handlers::get_movie_recommendations),
        )
        .route("/movie/{movie_id}/similar", get(handlers::get_similar_movies))
}
