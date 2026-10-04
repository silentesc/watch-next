use crate::integrations::tmdb::{
    client::TmdbClient, errors::TmdbError, models::tv_season::TvSeasonDetails,
    resources::tv_seasons::dto::TvSeasonDetailsParams,
};

pub mod dto;

pub struct TvSeasonApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> TvSeasonApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn details(
        &self,
        series_id: i32,
        season_number: i32,
        params: TvSeasonDetailsParams,
    ) -> Result<TvSeasonDetails, TmdbError> {
        self.tmdb_client
            .get(format!("/tv/{series_id}/season/{season_number}").as_str(), &params)
            .await
    }
}
