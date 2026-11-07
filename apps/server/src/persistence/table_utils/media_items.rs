use sqlx::PgPool;

use crate::{
    app::errors::AppError,
    error,
    features::media_items::dto::GetMediaItemTagsRequest,
    logger::enums::category::Category,
    persistence::models::{CustomList, MediaItem, Tag},
};

const GET_MEDIA_ITEM_CUSTOM_LISTS: &str = r#"
    SELECT
        cl.id,
        cl.name,
        cl.user_id,
        cl.created_at,
        cl.updated_at,
        COALESCE(
            (
                SELECT array_agg(
                    x.poster_path
                    ORDER BY x.added_at, x.media_item_id
                )
                FROM (
                    SELECT
                        cli.media_item_id,
                        cli.added_at,
                        mi.poster_path
                    FROM custom_list_items AS cli
                    JOIN media_items AS mi
                        ON mi.id = cli.media_item_id
                    WHERE cli.list_id = cl.id
                    AND mi.poster_path IS NOT NULL
                    ORDER BY cli.added_at, cli.media_item_id
                    LIMIT 4
                ) AS x
            ),
            '{}'::text[]
        ) AS preview_posters
    FROM media_items AS mi
    INNER JOIN custom_list_items AS cli ON cli.media_item_id = mi.id
    INNER JOIN custom_lists AS cl ON cl.id = cli.list_id
    WHERE cl.user_id = $1
        AND mi.kind = $2
        AND mi.external_source = $3
        AND mi.external_id = $4
    ORDER BY cl.created_at, cl.id
    "#;

const GET_MEDIA_ITEM_TAGS: &str = r#"
    SELECT
        t.id,
        t.name,
        t.user_id,
        t.created_at,
        t.updated_at
    FROM media_items AS mi
    INNER JOIN tags_items AS ti ON ti.media_item_id = mi.id
    INNER JOIN tags AS t ON t.id = ti.tag_id
    WHERE t.user_id = $1
        AND mi.kind = $2
        AND mi.external_source = $3
        AND mi.external_id = $4
    ORDER BY t.created_at, t.id
    "#;

pub async fn get_media_item(
    pool: &PgPool,
    kind: &str,
    external_source: &str,
    external_id: i32,
) -> Result<Option<MediaItem>, AppError> {
    let query = r#"
        SELECT kind, title, poster_path, release_date, external_source, external_id
        FROM media_items
        WHERE kind = $1
            AND external_source = $2
            AND external_id = $3
        "#;
    sqlx::query_as(query)
        .bind(kind)
        .bind(external_source)
        .bind(external_id)
        .fetch_optional(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Getting custom lists of media item failed with error: {:#?}", err
            );
            AppError::generic_500()
        })
}

pub async fn get_media_item_custom_lists(
    pool: &PgPool,
    user_id: i64,
    kind: &str,
    external_source: &str,
    external_id: i32,
) -> Result<Vec<CustomList>, AppError> {
    sqlx::query_as(GET_MEDIA_ITEM_CUSTOM_LISTS)
        .bind(user_id)
        .bind(kind)
        .bind(external_source)
        .bind(external_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(
                Category::Db,
                "Getting custom lists of media item failed with error: {:#?}", err
            );
            AppError::generic_500()
        })
}

pub async fn get_media_item_tags(
    pool: &PgPool,
    user_id: i64,
    params: GetMediaItemTagsRequest,
) -> Result<Vec<Tag>, AppError> {
    sqlx::query_as(GET_MEDIA_ITEM_TAGS)
        .bind(user_id)
        .bind(params.kind)
        .bind(params.external_source)
        .bind(params.external_id)
        .fetch_all(pool)
        .await
        .map_err(|err| {
            error!(Category::Db, "Getting tags of media item failed with error: {:#?}", err);
            AppError::generic_500()
        })
}

/**
 * Create or update a media item and get its id
 */
pub async fn upsert_media_items(pool: &PgPool, media_items: Vec<MediaItem>) -> Result<Vec<i64>, AppError> {
    let mut kinds = Vec::with_capacity(media_items.len());
    let mut titles = Vec::with_capacity(media_items.len());
    let mut poster_paths = Vec::with_capacity(media_items.len());
    let mut release_dates = Vec::with_capacity(media_items.len());
    let mut external_sources = Vec::with_capacity(media_items.len());
    let mut external_ids = Vec::with_capacity(media_items.len());

    for item in media_items {
        kinds.push(item.kind);
        titles.push(item.title);
        poster_paths.push(item.poster_path);
        release_dates.push(item.release_date);
        external_sources.push(item.external_source);
        external_ids.push(item.external_id);
    }

    let ids = sqlx::query_scalar(
        r#"
        INSERT INTO media_items (kind, title, poster_path, release_date, external_source, external_id)
        SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::integer[])
        ON CONFLICT (kind, external_source, external_id)
        DO UPDATE SET
            title = EXCLUDED.title,
            poster_path = EXCLUDED.poster_path,
            release_date = EXCLUDED.release_date
        RETURNING id
        "#,
    )
    .bind(kinds)
    .bind(titles)
    .bind(poster_paths)
    .bind(release_dates)
    .bind(external_sources)
    .bind(external_ids)
    .fetch_all(pool)
    .await
    .map_err(|err| {
        error!(Category::Db, "Upserting media item failed with error: {:#?}", err);
        AppError::generic_500()
    })?;

    Ok(ids)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_media_item_query_scopes_access_to_the_requesting_user() {
        let scoped_queries = [
            (GET_MEDIA_ITEM_CUSTOM_LISTS, "user_id = $"),
            (GET_MEDIA_ITEM_TAGS, "user_id = $"),
        ];

        for (query, user_scope) in scoped_queries {
            assert!(query.contains(user_scope), "query is missing user scope: {query}");
        }
    }
}
