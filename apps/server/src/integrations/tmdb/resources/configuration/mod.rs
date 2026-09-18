use crate::integrations::tmdb::{client::TmdbClient, errors::TmdbError, models::common::Language};

pub struct ConfigurationApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> ConfigurationApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn languages(&self) -> Result<Vec<Language>, TmdbError> {
        self.tmdb_client.get("/configuration/languages", &()).await
    }
}
