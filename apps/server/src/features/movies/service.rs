use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        models::common::TimeWindow,
        models::movies::MovieDetails,
        resources::movies::dto::{
            DiscoverMovieParams, DiscoverMovieResponse, MovieCreditsParams, MovieCreditsResponse, MovieDetailsParams,
            MovieRecommendationsParams, MovieRecommendationsResponse, MovieReleaseDatesResponse, MovieVideosParams,
            MovieVideosResponse, SearchMoviesParams, SearchMoviesResponse, SimilarMoviesParams, SimilarMoviesResponse,
            TrendingMoviesParams, TrendingMoviesResponse,
        },
    },
};

pub async fn get_details(tmdb: TmdbApi, movie_id: i32, params: MovieDetailsParams) -> Result<MovieDetails, AppError> {
    tmdb.movies().details(movie_id, params).await.map_err(Into::into)
}

pub async fn discover_movies(tmdb: TmdbApi, params: DiscoverMovieParams) -> Result<DiscoverMovieResponse, AppError> {
    let mut response: DiscoverMovieResponse = tmdb.movies().discover(params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|movie| seen_ids.insert(movie.id));
    Ok(response)
}

pub async fn get_trending_movies(
    tmdb: TmdbApi,
    time_window: String,
    params: TrendingMoviesParams,
) -> Result<TrendingMoviesResponse, AppError> {
    let mut response: TrendingMoviesResponse = tmdb
        .movies()
        .trending(TimeWindow::from_str(&time_window), params)
        .await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|movie| seen_ids.insert(movie.id));
    Ok(response)
}

pub async fn search_movie(tmdb: TmdbApi, params: SearchMoviesParams) -> Result<SearchMoviesResponse, AppError> {
    let mut response: SearchMoviesResponse = tmdb.movies().search(params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|movie| seen_ids.insert(movie.id));
    Ok(response)
}

pub async fn get_credits(
    tmdb: TmdbApi,
    movie_id: i32,
    params: MovieCreditsParams,
) -> Result<MovieCreditsResponse, AppError> {
    tmdb.movies().credits(movie_id, params).await.map_err(Into::into)
}

pub async fn get_recommendations(
    tmdb: TmdbApi,
    movie_id: i32,
    params: MovieRecommendationsParams,
) -> Result<MovieRecommendationsResponse, AppError> {
    tmdb.movies()
        .recommendations(movie_id, params)
        .await
        .map_err(Into::into)
}

pub async fn get_release_dates(tmdb: TmdbApi, movie_id: i32) -> Result<MovieReleaseDatesResponse, AppError> {
    tmdb.movies().release_dates(movie_id).await.map_err(Into::into)
}

pub async fn get_similar(
    tmdb: TmdbApi,
    movie_id: i32,
    params: SimilarMoviesParams,
) -> Result<SimilarMoviesResponse, AppError> {
    tmdb.movies().similar(movie_id, params).await.map_err(Into::into)
}

pub async fn get_videos(
    tmdb: TmdbApi,
    movie_id: i32,
    params: MovieVideosParams,
) -> Result<MovieVideosResponse, AppError> {
    tmdb.movies().videos(movie_id, params).await.map_err(Into::into)
}
