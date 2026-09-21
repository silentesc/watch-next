use reqwest::StatusCode;
use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    integrations::tmdb::{
        TmdbApi,
        resources::{movies::dto::MovieDetailsParams, tv_series::dto::TvSeriesDetailsParams},
    },
    persistence::{
        models::{CustomList, MediaItem},
        table_utils::custom_lists,
    },
};

pub async fn get_custom_lists(pool: &PgPool, user_id: i64) -> Result<Vec<CustomList>, AppError> {
    custom_lists::get_custom_lists(pool, user_id).await
}

pub async fn create_custom_list(pool: &PgPool, user_id: i64, list_name: String) -> Result<i64, AppError> {
    custom_lists::create_custom_list(pool, user_id, &list_name).await
}

pub async fn update_custom_list(pool: &PgPool, user_id: i64, list_id: i64, list_name: String) -> Result<(), AppError> {
    custom_lists::update_custom_list(pool, user_id, list_id, &list_name).await
}

pub async fn delete_custom_list(pool: &PgPool, user_id: i64, list_id: i64) -> Result<(), AppError> {
    custom_lists::delete_custom_list(pool, user_id, list_id).await
}

pub async fn get_media_items_in_list(pool: &PgPool, user_id: i64, list_id: i64) -> Result<Vec<MediaItem>, AppError> {
    custom_lists::get_media_items_in_list(pool, user_id, list_id).await
}

pub async fn add_media_item_to_list(
    pool: &PgPool,
    tmdb: &TmdbApi,
    user_id: i64,
    list_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i64,
) -> Result<(), AppError> {
    custom_lists::ensure_custom_list_id_exists(pool, list_id, user_id).await?;

    let (title, poster_path, release_date) = match (kind, external_source) {
        ("movie", "tmdb") => {
            let details = tmdb
                .movies()
                .details(
                    external_id,
                    MovieDetailsParams {
                        append_to_response: None,
                        language: None,
                    },
                )
                .await
                .map_err(AppError::from)?;

            (details.title, details.poster_path, details.release_date)
        }
        ("tv_series", "tmdb") => {
            let details = tmdb
                .tv_series()
                .details(
                    external_id,
                    TvSeriesDetailsParams {
                        append_to_response: None,
                        language: None,
                    },
                )
                .await
                .map_err(AppError::from)?;

            (details.name, details.poster_path, details.first_air_date)
        }
        _ => {
            return Err(AppError::new(
                StatusCode::BAD_REQUEST,
                String::from("Invalid media item kind or external source."),
            ));
        }
    };

    let media_item = MediaItem {
        kind: kind.to_string(),
        title,
        poster_path,
        release_date,
        external_source: external_source.to_string(),
        external_id,
    };

    custom_lists::add_media_item_to_list(pool, user_id, list_id, media_item).await
}

pub async fn delete_media_item_from_list(
    pool: &PgPool,
    user_id: i64,
    list_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i64,
) -> Result<(), AppError> {
    custom_lists::delete_media_item_from_list(pool, user_id, list_id, kind, external_source, external_id).await
}
