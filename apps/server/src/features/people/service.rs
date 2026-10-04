use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        models::people::PersonDetails,
        resources::people::dto::{PersonCombinedCreditsParams, PersonCombinedCreditsResponse, PersonDetailsParams},
    },
};

pub async fn get_details(
    tmdb: TmdbApi,
    person_id: i32,
    params: PersonDetailsParams,
) -> Result<PersonDetails, AppError> {
    tmdb.people().details(person_id, params).await.map_err(Into::into)
}

pub async fn get_combined_credits(
    tmdb: TmdbApi,
    person_id: i32,
    params: PersonCombinedCreditsParams,
) -> Result<PersonCombinedCreditsResponse, AppError> {
    tmdb.people()
        .combined_credits(person_id, params)
        .await
        .map_err(Into::into)
}
