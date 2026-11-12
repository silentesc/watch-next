use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        resources::search::dto::{SearchMultiParams, SearchMultiResponse},
    },
};

pub async fn search_multi(tmdb: TmdbApi, params: SearchMultiParams) -> Result<SearchMultiResponse, AppError> {
    let mut response: SearchMultiResponse = tmdb.search().multi(params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|multi_search_result| {
        seen_ids.insert(format!(
            "{}{}",
            multi_search_result.as_str(),
            multi_search_result.get_media_id().unwrap_or_default()
        ))
    });
    Ok(response)
}
