use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    features::tags::dto::{TagMediaItemRequest, UntagMediaItemRequest},
    integrations::tmdb::{
        TmdbApi,
        resources::{
            collections::dto::CollectionDetailsParams, movies::dto::MovieDetailsParams,
            tv_seasons::dto::TvSeasonDetailsParams, tv_series::dto::TvSeriesDetailsParams,
        },
    },
    persistence::{
        models::{MediaItem, MediaItemTree, Tag},
        table_utils::{media_items, tags},
    },
};

async fn get_tv_series_tree(tmdb: &TmdbApi, series_id: i32) -> Result<MediaItemTree, AppError> {
    let details = tmdb
        .tv_series()
        .details(
            series_id,
            TvSeriesDetailsParams {
                append_to_response: None,
                language: None,
            },
        )
        .await?;

    Ok(MediaItemTree {
        kind: "tv_series".to_string(),
        title: details.name,
        poster_path: details.poster_path,
        release_date: details.first_air_date,
        external_source: "tmdb".to_string(),
        external_id: series_id,
        parent: None,
        season_number: None,
        episode_number: None,
    })
}

async fn get_tmdb_media_item_tree(
    tmdb: &TmdbApi,
    kind: &str,
    external_id: i32,
    season_number: Option<i32>,
    episode_number: Option<i32>,
) -> Result<MediaItemTree, AppError> {
    let tree = match kind {
        "collection" => {
            let details = tmdb
                .collections()
                .details(external_id, CollectionDetailsParams { language: None })
                .await?;
            let release_date = details
                .parts
                .and_then(|parts| parts.into_iter().next())
                .and_then(|part| part.release_date);

            MediaItemTree {
                kind: kind.to_string(),
                title: details.name,
                poster_path: details.poster_path,
                release_date,
                external_source: "tmdb".to_string(),
                external_id,
                parent: None,
                season_number: None,
                episode_number: None,
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

            MediaItemTree {
                kind: kind.to_string(),
                title: details.title,
                poster_path: details.poster_path,
                release_date: details.release_date,
                external_source: "tmdb".to_string(),
                external_id,
                parent: None,
                season_number: None,
                episode_number: None,
            }
        }
        "tv_series" => get_tv_series_tree(tmdb, external_id).await?,
        "tv_season" => {
            let season_number = season_number.ok_or_else(|| {
                AppError::new(
                    StatusCode::BAD_REQUEST,
                    String::from("season_number must not be null for tv_season kind"),
                )
            })?;
            let details = tmdb
                .tv_seasons()
                .details(
                    external_id,
                    season_number,
                    TvSeasonDetailsParams {
                        language: None,
                        append_to_response: None,
                    },
                )
                .await?;
            let parent = Some(Box::new(get_tv_series_tree(tmdb, external_id).await?));
            MediaItemTree {
                kind: "tv_season".to_string(),
                title: details.name,
                poster_path: details.poster_path,
                release_date: details.air_date,
                external_source: "tmdb".to_string(),
                external_id,
                parent,
                season_number: Some(season_number),
                episode_number: None,
            }
        }
        "tv_episode" => {
            let season_number = season_number.ok_or_else(|| {
                AppError::new(
                    StatusCode::BAD_REQUEST,
                    String::from("season_number must not be null for tv_episode kind"),
                )
            })?;
            let episode_number = episode_number.ok_or_else(|| {
                AppError::new(
                    StatusCode::BAD_REQUEST,
                    String::from("episode_number must not be null for tv_episode kind"),
                )
            })?;
            let season_details = tmdb
                .tv_seasons()
                .details(
                    external_id,
                    season_number,
                    TvSeasonDetailsParams {
                        language: None,
                        append_to_response: None,
                    },
                )
                .await?;
            let episode_details = season_details.episodes.and_then(|episodes| {
                episodes
                    .into_iter()
                    .find(|episode| episode.episode_number == Some(i64::from(episode_number)))
            });
            let season_parent = Some(Box::new(MediaItemTree {
                kind: "tv_season".to_string(),
                title: season_details.name,
                poster_path: season_details.poster_path,
                release_date: season_details.air_date,
                external_source: "tmdb".to_string(),
                external_id,
                parent: Some(Box::new(get_tv_series_tree(tmdb, external_id).await?)),
                season_number: Some(season_number),
                episode_number: None,
            }));
            let details = episode_details
                .map(|episode| (episode.name, episode.still_path, episode.air_date))
                .unwrap_or((None, None, None));
            MediaItemTree {
                kind: kind.to_string(),
                title: details.0,
                poster_path: details.1,
                release_date: details.2,
                external_source: "tmdb".to_string(),
                external_id,
                parent: season_parent,
                season_number: Some(season_number),
                episode_number: Some(episode_number),
            }
        }
        _ => {
            return Err(AppError::new(
                StatusCode::BAD_REQUEST,
                String::from("Invalid media item kind or external source."),
            ));
        }
    };

    Ok(tree)
}

pub async fn get_tags(pool: &PgPool, user_id: i64) -> Result<Vec<Tag>, AppError> {
    tags::get_tags(pool, user_id).await
}

pub async fn create_tag(pool: &PgPool, user_id: i64, tag_name: String) -> Result<i64, AppError> {
    tags::create_tag(pool, user_id, &tag_name).await
}

pub async fn update_tag(pool: &PgPool, user_id: i64, tag_id: i64, tag_name: String) -> Result<(), AppError> {
    tags::update_tag(pool, user_id, tag_id, &tag_name).await
}

pub async fn delete_tag(pool: &PgPool, user_id: i64, tag_id: i64) -> Result<(), AppError> {
    tags::delete_tag(pool, user_id, tag_id).await
}

async fn get_media_item_parent(pool: &PgPool, media_item: &MediaItem) -> Option<Box<MediaItemTree>> {
    let parent = match media_item.parent_id {
        Some(parent_id) => media_items::get_media_item_by_id(pool, parent_id).await.unwrap_or(None),
        None => None,
    };

    if let Some(parent) = parent {
        let parents_parent: Option<Box<MediaItemTree>> = Box::pin(get_media_item_parent(pool, &parent)).await;
        return Some(Box::new(MediaItemTree {
            kind: parent.kind,
            title: parent.title,
            poster_path: parent.poster_path,
            release_date: parent.release_date,
            external_source: parent.external_source,
            external_id: parent.external_id,
            parent: parents_parent,
            season_number: parent.season_number,
            episode_number: parent.episode_number,
        }));
    }

    None
}

pub async fn get_media_items_of_tag(pool: &PgPool, user_id: i64, tag_id: i64) -> Result<Vec<MediaItemTree>, AppError> {
    let media_items = tags::get_media_items_of_tag(pool, user_id, tag_id).await?;
    let mut media_items_response: Vec<MediaItemTree> = Vec::new();
    for item in media_items {
        let parent = get_media_item_parent(pool, &item).await;
        media_items_response.push(MediaItemTree {
            kind: item.kind,
            title: item.title,
            poster_path: item.poster_path,
            release_date: item.release_date,
            external_source: item.external_source,
            external_id: item.external_id,
            parent,
            season_number: item.season_number,
            episode_number: item.episode_number,
        });
    }
    Ok(media_items_response)
}

pub async fn tag_media_item(
    pool: &PgPool,
    tmdb: &TmdbApi,
    user_id: i64,
    tag_id: i64,
    request: TagMediaItemRequest,
) -> Result<(), AppError> {
    tags::ensure_tag_id_exists(pool, tag_id, user_id).await?;
    if request.external_source != "tmdb" {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Invalid media item kind or external source."),
        ));
    }

    let media_item_tree = get_tmdb_media_item_tree(
        tmdb,
        &request.kind,
        request.external_id,
        request.season_number,
        request.episode_number,
    )
    .await?;
    tags::tag_media_item(pool, user_id, tag_id, media_item_tree).await
}

pub async fn untag_media_item(
    pool: &PgPool,
    user_id: i64,
    tag_id: i64,
    request: UntagMediaItemRequest,
) -> Result<(), AppError> {
    tags::untag_media_item(pool, user_id, tag_id, request).await
}
