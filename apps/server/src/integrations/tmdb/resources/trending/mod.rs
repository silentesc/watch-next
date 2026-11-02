use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    models::common::TimeWindow,
    resources::trending::dto::{TrendingAllParams, TrendingAllResponse},
};

pub mod dto;

pub struct TrendingApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> TrendingApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn all(
        &self,
        time_window: TimeWindow,
        params: TrendingAllParams,
    ) -> Result<TrendingAllResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/trending/all/{}", time_window.as_str()).as_str(), &params)
            .await
    }
}
