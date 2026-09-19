use crate::integrations::tmdb::{
    client::TmdbClient,
    resources::{
        collections::CollectionsApi, configuration::ConfigurationApi, genres::GenresApi, movies::MoviesApi,
        tv_seasons::TvSeasonApi, tv_series::TvSeriesApi,
    },
};

pub mod client;
pub mod errors;
pub mod models;
pub mod resources;

#[derive(Clone)]
pub struct TmdbApi {
    tmdb_client: TmdbClient,
}

impl TmdbApi {
    pub fn new(tmdb_client: TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub fn movies(&self) -> MoviesApi<'_> {
        MoviesApi::new(&self.tmdb_client)
    }

    pub fn tv_series(&self) -> TvSeriesApi<'_> {
        TvSeriesApi::new(&self.tmdb_client)
    }

    pub fn tv_seasons(&self) -> TvSeasonApi<'_> {
        TvSeasonApi::new(&self.tmdb_client)
    }

    pub fn collections(&self) -> CollectionsApi<'_> {
        CollectionsApi::new(&self.tmdb_client)
    }

    pub fn configuration(&self) -> ConfigurationApi<'_> {
        ConfigurationApi::new(&self.tmdb_client)
    }

    pub fn genres(&self) -> GenresApi<'_> {
        GenresApi::new(&self.tmdb_client)
    }
}
