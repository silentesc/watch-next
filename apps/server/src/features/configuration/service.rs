use crate::{
    app::errors::AppError,
    integrations::tmdb::{TmdbApi, models::common::Language},
};

pub async fn get_languages(tmdb: TmdbApi) -> Result<Vec<Language>, AppError> {
    tmdb.configuration().languages().await.map_err(Into::into)
}
