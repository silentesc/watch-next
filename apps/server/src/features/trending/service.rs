use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        models::common::TimeWindow,
        resources::trending::dto::{TrendingAllParams, TrendingAllResponse},
    },
};

pub async fn trending_all(
    tmdb: TmdbApi,
    time_window: String,
    params: TrendingAllParams,
) -> Result<TrendingAllResponse, AppError> {
    let mut response = tmdb.trending().all(TimeWindow::from_str(&time_window), params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response
        .results
        .retain(|result| seen_ids.insert((result.as_str().to_string(), result.get_media_id().unwrap_or_default())));
    Ok(response)
}
