use axum::extract::FromRef;
use axum_extra::extract::cookie::Key;
use sqlx::PgPool;

use crate::integrations::tmdb::TmdbApi;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub tmdb: TmdbApi,
    pub key: Key,
    pub allow_registration: bool,
}

impl FromRef<AppState> for Key {
    fn from_ref(state: &AppState) -> Self {
        state.key.clone()
    }
}
