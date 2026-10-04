use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    models::people::PersonDetails,
    resources::people::dto::{PersonCombinedCreditsParams, PersonCombinedCreditsResponse, PersonDetailsParams},
};

pub mod dto;

pub struct PeopleApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> PeopleApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn details(&self, person_id: i32, params: PersonDetailsParams) -> Result<PersonDetails, TmdbError> {
        self.tmdb_client
            .get(format!("/person/{person_id}").as_str(), &params)
            .await
    }

    pub async fn combined_credits(
        &self,
        person_id: i32,
        params: PersonCombinedCreditsParams,
    ) -> Result<PersonCombinedCreditsResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/person/{person_id}/combined_credits").as_str(), &params)
            .await
    }
}
