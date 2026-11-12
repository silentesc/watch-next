use crate::{app::errors::AppError, integrations::tmdb::TmdbApi, integrations::tmdb::models::common::Keyword};

pub async fn get_keyword_details(tmdb: TmdbApi, keyword_id: i32) -> Result<Keyword, AppError> {
    tmdb.keyword().details(keyword_id).await.map_err(Into::into)
}
