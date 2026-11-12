use crate::integrations::tmdb::{client::TmdbClient, errors::TmdbError, models::common::Keyword};

pub struct KeywordApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> KeywordApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn details(&self, keyword_id: i32) -> Result<Keyword, TmdbError> {
        self.tmdb_client
            .get(format!("/keyword/{keyword_id}").as_str(), &())
            .await
    }
}
