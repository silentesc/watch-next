use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    resources::genres::dto::{GenreMovieListParams, GenreMovieListResponse, GenreTvListParams, GenreTvListResponse},
};

pub mod dto;

pub struct GenresApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> GenresApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn movie_list(&self, params: GenreMovieListParams) -> Result<GenreMovieListResponse, TmdbError> {
        self.tmdb_client.get("/genre/movie/list", &params).await
    }

    pub async fn tv_list(&self, params: GenreTvListParams) -> Result<GenreTvListResponse, TmdbError> {
        self.tmdb_client.get("/genre/tv/list", &params).await
    }
}
