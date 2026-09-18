use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        models::common::TimeWindow,
        models::tv_series::TvSeriesDetails,
        resources::tv_series::dto::{
            DiscoverTvSeriesParams, DiscoverTvSeriesResponse, SearchTvSeriesParams, SearchTvSeriesResponse,
            SimilarTvSeriesParams, SimilarTvSeriesResponse, TrendingTvSeriesParams, TrendingTvSeriesResponse,
            TvSeriesAggregateCreditsParams, TvSeriesAggregateCreditsResponse, TvSeriesDetailsParams,
            TvSeriesRecommendationsParams, TvSeriesRecommendationsResponse, TvSeriesVideosParams,
            TvSeriesVideosResponse,
        },
    },
};

pub async fn get_series_details(
    tmdb: TmdbApi,
    series_id: i32,
    params: TvSeriesDetailsParams,
) -> Result<TvSeriesDetails, AppError> {
    tmdb.tv_series().details(series_id, params).await.map_err(Into::into)
}

pub async fn discover_tv_series(
    tmdb: TmdbApi,
    params: DiscoverTvSeriesParams,
) -> Result<DiscoverTvSeriesResponse, AppError> {
    let mut response: DiscoverTvSeriesResponse = tmdb.tv_series().discover(params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|series| seen_ids.insert(series.id));
    Ok(response)
}

pub async fn get_trending_tv_series(
    tmdb: TmdbApi,
    time_window: String,
    params: TrendingTvSeriesParams,
) -> Result<TrendingTvSeriesResponse, AppError> {
    let mut response: TrendingTvSeriesResponse = tmdb
        .tv_series()
        .trending(TimeWindow::from_str(&time_window), params)
        .await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|series| seen_ids.insert(series.id));
    Ok(response)
}

pub async fn search_tv_series(tmdb: TmdbApi, params: SearchTvSeriesParams) -> Result<SearchTvSeriesResponse, AppError> {
    let mut response: SearchTvSeriesResponse = tmdb.tv_series().search(params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|series| seen_ids.insert(series.id));
    Ok(response)
}

pub async fn get_tv_series_recommendations(
    tmdb: TmdbApi,
    series_id: i32,
    params: TvSeriesRecommendationsParams,
) -> Result<TvSeriesRecommendationsResponse, AppError> {
    let mut response: TvSeriesRecommendationsResponse = tmdb.tv_series().recommendations(series_id, params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|series| seen_ids.insert(series.id));
    Ok(response)
}

pub async fn get_similar_tv_series(
    tmdb: TmdbApi,
    series_id: i32,
    params: SimilarTvSeriesParams,
) -> Result<SimilarTvSeriesResponse, AppError> {
    let mut response: SimilarTvSeriesResponse = tmdb.tv_series().similar(series_id, params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|series| seen_ids.insert(series.id));
    Ok(response)
}

pub async fn get_tv_series_videos(
    tmdb: TmdbApi,
    series_id: i32,
    params: TvSeriesVideosParams,
) -> Result<TvSeriesVideosResponse, AppError> {
    tmdb.tv_series().videos(series_id, params).await.map_err(Into::into)
}

pub async fn get_tv_series_aggregate_credits(
    tmdb: TmdbApi,
    series_id: i32,
    params: TvSeriesAggregateCreditsParams,
) -> Result<TvSeriesAggregateCreditsResponse, AppError> {
    tmdb.tv_series()
        .aggregate_credits(series_id, params)
        .await
        .map_err(Into::into)
}
