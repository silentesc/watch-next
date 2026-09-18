use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    resources::collections::dto::{
        CollectionDetailsParams, CollectionDetailsResponse, SearchCollectionsParams, SearchCollectionsResponse,
    },
};

pub mod dto;

pub struct CollectionsApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> CollectionsApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn search(&self, params: SearchCollectionsParams) -> Result<SearchCollectionsResponse, TmdbError> {
        self.tmdb_client.get("/search/collection", &params).await
    }

    pub async fn details(
        &self,
        collection_id: i32,
        params: CollectionDetailsParams,
    ) -> Result<CollectionDetailsResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/collection/{}", collection_id).as_str(), &params)
            .await
    }
}
