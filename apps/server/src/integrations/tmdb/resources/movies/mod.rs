use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    models::{common::TimeWindow, movies::MovieDetails},
    resources::movies::dto::{
        DiscoverMovieParams, DiscoverMovieResponse, MovieCreditsParams, MovieCreditsResponse, MovieDetailsParams,
        MovieRecommendationsParams, MovieRecommendationsResponse, MovieReleaseDatesResponse, MovieVideosParams,
        MovieVideosResponse, SearchMoviesParams, SearchMoviesResponse, SimilarMoviesParams, SimilarMoviesResponse,
        TrendingMoviesParams, TrendingMoviesResponse,
    },
};

pub mod dto;

pub struct MoviesApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> MoviesApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn search(&self, params: SearchMoviesParams) -> Result<SearchMoviesResponse, TmdbError> {
        self.tmdb_client.get("/search/movie", &params).await
    }

    pub async fn details(&self, movie_id: i32, params: MovieDetailsParams) -> Result<MovieDetails, TmdbError> {
        self.tmdb_client
            .get(format!("/movie/{movie_id}").as_str(), &params)
            .await
    }

    pub async fn discover(&self, params: DiscoverMovieParams) -> Result<DiscoverMovieResponse, TmdbError> {
        self.tmdb_client.get("/discover/movie", &params).await
    }

    pub async fn credits(&self, movie_id: i32, params: MovieCreditsParams) -> Result<MovieCreditsResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/movie/{movie_id}/credits").as_str(), &params)
            .await
    }

    pub async fn recommendations(
        &self,
        movie_id: i32,
        params: MovieRecommendationsParams,
    ) -> Result<MovieRecommendationsResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/movie/{movie_id}/recommendations").as_str(), &params)
            .await
    }

    pub async fn release_dates(&self, movie_id: i32) -> Result<MovieReleaseDatesResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/movie/{movie_id}/release_dates").as_str(), &())
            .await
    }

    pub async fn similar(
        &self,
        movie_id: i32,
        params: SimilarMoviesParams,
    ) -> Result<SimilarMoviesResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/movie/{movie_id}/similar").as_str(), &params)
            .await
    }

    pub async fn videos(&self, movie_id: i32, params: MovieVideosParams) -> Result<MovieVideosResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/movie/{movie_id}/videos").as_str(), &params)
            .await
    }

    pub async fn trending(
        &self,
        time_window: TimeWindow,
        params: TrendingMoviesParams,
    ) -> Result<TrendingMoviesResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/trending/movie/{}", time_window.as_str()).as_str(), &params)
            .await
    }
}
