use serde::{Serialize, de::DeserializeOwned};
use sqlx::PgPool;
use time::OffsetDateTime;

use crate::{app::errors::AppError, error, logger::enums::category::Category};

/**
 * Get cache entry value by key
 */
pub async fn get<T>(pool: &PgPool, key: &str) -> Result<Option<T>, AppError>
where
    T: DeserializeOwned,
{
    let value: Option<serde_json::Value> = sqlx::query_scalar(
        r#"
        SELECT value
        FROM cache
        WHERE cache_key = $1
            AND expires_at > NOW()
        "#,
    )
    .bind(key)
    .fetch_optional(pool)
    .await
    .map_err(|err| {
        error!(Category::Db, "Getting cache by key failed with error: {:#?}", err);
        AppError::generic_500()
    })?;

    value
        .map(|json| {
            serde_json::from_value(json).map_err(|err| {
                error!(
                    Category::Db,
                    "Parsing cache json to value failed with error: {:#?}", err
                );
                AppError::generic_500()
            })
        })
        .transpose()
}

/**
 * Create or update a cache entry
 */
pub async fn set<T>(pool: &PgPool, key: &str, value: &T, expires_at: OffsetDateTime) -> Result<(), AppError>
where
    T: Serialize,
{
    let json = serde_json::to_value(value).map_err(|err| {
        error!(
            Category::Db,
            "Parsing cache value to json failed with error: {:#?}", err
        );
        AppError::generic_500()
    })?;

    match sqlx::query(
        r#"
        INSERT INTO cache (cache_key, value, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (cache_key)
        DO UPDATE SET
            value = EXCLUDED.value,
            expires_at = EXCLUDED.expires_at,
            updated_at = NOW()
        "#,
    )
    .bind(key)
    .bind(json)
    .bind(expires_at)
    .execute(pool)
    .await
    {
        Ok(_) => Ok(()),
        Err(err) => {
            error!(Category::Db, "Setting cache failed with error: {:#?}", err);
            Err(AppError::generic_500())
        }
    }
}

/**
 * Delete all expired cache entries and get how many were removed
 */
pub async fn clear_expired(pool: &PgPool) -> Result<u64, AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM cache
        WHERE expires_at <= NOW()
        "#,
    )
    .execute(pool)
    .await
    .map_err(|err| {
        error!(
            Category::Db,
            "Deleting expired cache rows failed with error: {:#?}", err
        );
        AppError::generic_500()
    })?;

    Ok(result.rows_affected())
}
