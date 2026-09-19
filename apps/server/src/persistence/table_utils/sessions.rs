use sqlx::PgPool;
use time::OffsetDateTime;

use crate::{
    app::errors::AppError, error, logger::enums::category::Category, persistence::models::Session, utils::security,
};

/**
 * Get session by session token
 */
pub async fn get_session_by_token(pool: &PgPool, token: &str) -> Result<Option<Session>, AppError> {
    let token_hash = security::hash_session_token(token);
    let session: Option<Session> = match sqlx::query_as(
        r#"
        SELECT id, user_id, created_at, expires_at
        FROM sessions
        WHERE token_hash = $1
            AND expires_at > NOW()
        "#,
    )
    .bind(token_hash)
    .fetch_optional(pool)
    .await
    {
        Ok(session) => session,
        Err(err) => {
            error!(Category::Db, "Getting session by token failed with error: {:#?}", err);
            return Err(AppError::generic_500());
        }
    };

    Ok(session)
}

/**
 * Create session and get session token
 */
pub async fn create_session(pool: &PgPool, user_id: i64, expires_at: OffsetDateTime) -> Result<String, AppError> {
    let session_token = match security::generate_secure_256() {
        Ok(session_token) => session_token,
        Err(err) => {
            error!(
                Category::Middleware,
                "Generating session id failed with error: {:#?}", err
            );
            return Err(AppError::generic_500());
        }
    };

    let token_hash = security::hash_session_token(&session_token);

    sqlx::query(
        r#"
        INSERT INTO sessions (token_hash, user_id, expires_at)
        VALUES ($1, $2, $3)
        "#,
    )
    .bind(token_hash)
    .bind(user_id)
    .bind(expires_at)
    .execute(pool)
    .await
    .map_err(|err| {
        error!(Category::Db, "Creating session failed with error: {:#?}", err);
        AppError::generic_500()
    })?;

    Ok(session_token)
}

/**
 * Delete a session
 */
pub async fn delete_session(pool: &PgPool, token: &str) -> Result<(), AppError> {
    let token_hash = security::hash_session_token(token);
    match sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE token_hash = $1
        "#,
    )
    .bind(token_hash)
    .execute(pool)
    .await
    {
        Ok(_) => Ok(()),
        Err(err) => {
            error!(Category::Db, "Deleting session failed with error: {:#?}", err);
            Err(AppError::generic_500())
        }
    }
}

/**
 * Delete all expired sessions and get how many were removed
 */
pub async fn clear_expired(pool: &PgPool) -> Result<u64, AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE expires_at <= NOW()
        "#,
    )
    .execute(pool)
    .await
    .map_err(|err| {
        error!(Category::Db, "Deleting expired sessions failed with error: {:#?}", err);
        AppError::generic_500()
    })?;

    Ok(result.rows_affected())
}
