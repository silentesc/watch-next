use axum::{Router, routing::get};

use crate::{app::state::AppState, features::genres::handlers};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/genre/movie/list", get(handlers::get_movie_genres))
        .route("/genre/tv/list", get(handlers::get_tv_genres))
}
