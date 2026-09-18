use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi, models::tv_season::TvSeasonDetails, resources::tv_seasons::dto::TvSeasonDetailsParams,
    },
};

pub async fn get_season_details(
    tmdb: TmdbApi,
    series_id: i32,
    season_number: i32,
    params: TvSeasonDetailsParams,
) -> Result<TvSeasonDetails, AppError> {
    tmdb.tv_seasons()
        .details(series_id, season_number, params)
        .await
        .map_err(Into::into)
}
