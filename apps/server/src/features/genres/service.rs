use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        resources::genres::dto::{
            GenreMovieListParams, GenreMovieListResponse, GenreTvListParams, GenreTvListResponse,
        },
    },
};

pub async fn get_movie_genres(tmdb: TmdbApi, params: GenreMovieListParams) -> Result<GenreMovieListResponse, AppError> {
    tmdb.genres().movie_list(params).await.map_err(Into::into)
}

pub async fn get_tv_genres(tmdb: TmdbApi, params: GenreTvListParams) -> Result<GenreTvListResponse, AppError> {
    tmdb.genres().tv_list(params).await.map_err(Into::into)
}
