use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    resources::search::dto::{SearchKeywordParams, SearchKeywordResponse, SearchMultiParams, SearchMultiResponse},
};

pub mod dto;

pub struct SearchApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> SearchApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn multi(&self, params: SearchMultiParams) -> Result<SearchMultiResponse, TmdbError> {
        self.tmdb_client.get("/search/multi", &params).await
    }

    pub async fn keyword(&self, params: SearchKeywordParams) -> Result<SearchKeywordResponse, TmdbError> {
        self.tmdb_client.get("/search/keyword", &params).await
    }
}
