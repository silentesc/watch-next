use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    features::media_items::dto::GetMediaItemTagsRequest,
    integrations::tmdb::{
        TmdbApi,
        resources::{
            collections::dto::CollectionDetailsParams, movies::dto::MovieDetailsParams,
            tv_series::dto::TvSeriesDetailsParams,
        },
    },
    persistence::{
        models::{CustomList, MediaItem, Tag},
        table_utils::media_items,
    },
};

pub async fn get_tmdb_media_item(
    pool: &PgPool,
    tmdb: &TmdbApi,
    kind: &str,
    external_id: i32,
) -> Result<MediaItem, AppError> {
    if let Some(item) = media_items::get_media_item(pool, kind, "tmdb", external_id).await? {
        return Ok(item);
    }

    let item = match kind {
        "collection" => {
            let details = tmdb
                .collections()
                .details(external_id, CollectionDetailsParams { language: None })
                .await?;
            let release_date = details
                .parts
                .and_then(|parts| parts.into_iter().next())
                .and_then(|part| part.release_date);

            MediaItem {
                kind: kind.to_string(),
                title: details.name,
                poster_path: details.poster_path,
                release_date,
                external_source: "tmdb".to_string(),
                external_id,
            }
        }
        "movie" => {
            let details = tmdb
                .movies()
                .details(
                    external_id,
                    MovieDetailsParams {
                        append_to_response: None,
                        language: None,
                    },
                )
                .await?;

            MediaItem {
                kind: kind.to_string(),
                title: details.title,
                poster_path: details.poster_path,
                release_date: details.release_date,
                external_source: "tmdb".to_string(),
                external_id,
            }
        }
        "tv_series" => {
            let details = tmdb
                .tv_series()
                .details(
                    external_id,
                    TvSeriesDetailsParams {
                        append_to_response: None,
                        language: None,
                    },
                )
                .await?;

            MediaItem {
                kind: kind.to_string(),
                title: details.name,
                poster_path: details.poster_path,
                release_date: details.first_air_date,
                external_source: "tmdb".to_string(),
                external_id,
            }
        }
        _ => {
            return Err(AppError::new(
                StatusCode::BAD_REQUEST,
                String::from("Invalid media item kind or external source."),
            ));
        }
    };

    Ok(item)
}

pub async fn get_media_item_custom_lists(
    pool: &PgPool,
    user_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i32,
) -> Result<Vec<CustomList>, AppError> {
    media_items::get_media_item_custom_lists(pool, user_id, kind, external_source, external_id).await
}

pub async fn get_media_item_tags(
    pool: &PgPool,
    user_id: i64,
    params: GetMediaItemTagsRequest,
) -> Result<Vec<Tag>, AppError> {
    media_items::get_media_item_tags(pool, user_id, params).await
}
