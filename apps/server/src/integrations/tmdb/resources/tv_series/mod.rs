use crate::integrations::tmdb::{
    client::TmdbClient,
    errors::TmdbError,
    models::{common::TimeWindow, tv_series::TvSeriesDetails},
    resources::tv_series::dto::{
        DiscoverTvSeriesParams, DiscoverTvSeriesResponse, SearchTvSeriesParams, SearchTvSeriesResponse,
        SimilarTvSeriesParams, SimilarTvSeriesResponse, TrendingTvSeriesParams, TrendingTvSeriesResponse,
        TvSeriesAggregateCreditsParams, TvSeriesAggregateCreditsResponse, TvSeriesDetailsParams,
        TvSeriesRecommendationsParams, TvSeriesRecommendationsResponse, TvSeriesVideosParams, TvSeriesVideosResponse,
    },
};

pub mod dto;

pub struct TvSeriesApi<'a> {
    tmdb_client: &'a TmdbClient,
}

impl<'a> TvSeriesApi<'a> {
    pub fn new(tmdb_client: &'a TmdbClient) -> Self {
        Self { tmdb_client }
    }

    pub async fn search(&self, params: SearchTvSeriesParams) -> Result<SearchTvSeriesResponse, TmdbError> {
        self.tmdb_client.get("/search/tv", &params).await
    }

    pub async fn details(&self, series_id: i64, params: TvSeriesDetailsParams) -> Result<TvSeriesDetails, TmdbError> {
        self.tmdb_client.get(format!("/tv/{series_id}").as_str(), &params).await
    }

    pub async fn discover(&self, params: DiscoverTvSeriesParams) -> Result<DiscoverTvSeriesResponse, TmdbError> {
        self.tmdb_client.get("/discover/tv", &params).await
    }

    pub async fn trending(
        &self,
        time_window: TimeWindow,
        params: TrendingTvSeriesParams,
    ) -> Result<TrendingTvSeriesResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/trending/tv/{}", time_window.as_str()).as_str(), &params)
            .await
    }

    pub async fn recommendations(
        &self,
        series_id: i32,
        params: TvSeriesRecommendationsParams,
    ) -> Result<TvSeriesRecommendationsResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/tv/{series_id}/recommendations").as_str(), &params)
            .await
    }

    pub async fn similar(
        &self,
        series_id: i32,
        params: SimilarTvSeriesParams,
    ) -> Result<SimilarTvSeriesResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/tv/{series_id}/similar").as_str(), &params)
            .await
    }

    pub async fn videos(
        &self,
        series_id: i32,
        params: TvSeriesVideosParams,
    ) -> Result<TvSeriesVideosResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/tv/{series_id}/videos").as_str(), &params)
            .await
    }

    pub async fn aggregate_credits(
        &self,
        series_id: i32,
        params: TvSeriesAggregateCreditsParams,
    ) -> Result<TvSeriesAggregateCreditsResponse, TmdbError> {
        self.tmdb_client
            .get(format!("/tv/{series_id}/aggregate_credits").as_str(), &params)
            .await
    }
}
