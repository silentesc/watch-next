use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        resources::collections::dto::{
            CollectionDetailsParams, CollectionDetailsResponse, SearchCollectionsParams, SearchCollectionsResponse,
        },
    },
};

pub async fn get_collection_details(
    tmdb: TmdbApi,
    collection_id: i32,
    params: CollectionDetailsParams,
) -> Result<CollectionDetailsResponse, AppError> {
    tmdb.collections()
        .details(collection_id, params)
        .await
        .map_err(Into::into)
}

pub async fn search_collection(
    tmdb: TmdbApi,
    params: SearchCollectionsParams,
) -> Result<SearchCollectionsResponse, AppError> {
    let mut response: SearchCollectionsResponse = tmdb.collections().search(params).await?;
    let mut seen_ids = std::collections::HashSet::new();
    response.results.retain(|collection| seen_ids.insert(collection.id));
    Ok(response)
}
