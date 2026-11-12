use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        models::common::Keyword,
        resources::search::dto::{SearchKeywordParams, SearchKeywordResponse},
    },
};

pub async fn get_keyword_details(tmdb: TmdbApi, keyword_id: i32) -> Result<Keyword, AppError> {
    tmdb.keyword().details(keyword_id).await.map_err(Into::into)
}

pub async fn search_keyword(tmdb: TmdbApi, params: SearchKeywordParams) -> Result<SearchKeywordResponse, AppError> {
    tmdb.keyword().search(params).await.map_err(Into::into)
}
