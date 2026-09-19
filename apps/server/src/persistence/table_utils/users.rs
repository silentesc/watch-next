use sqlx::PgPool;
use uuid::Uuid;

use crate::{app::errors::AppError, error, logger::enums::category::Category, persistence::models::User};

/**
 * Get user by id
 */
pub async fn get_user_by_id(pool: &PgPool, id: Uuid) -> Result<Option<User>, AppError> {
    let user: Option<User> = match sqlx::query_as("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(pool)
        .await
    {
        Ok(user) => user,
        Err(err) => {
            error!(Category::Db, "Getting user by id failed with error: {:#?}", err);
            return Err(AppError::generic_500());
        }
    };

    Ok(user)
}

/**
 * Get user by username
 */
pub async fn get_user_by_username(pool: &PgPool, username: &str) -> Result<Option<User>, AppError> {
    let user: Option<User> = match sqlx::query_as("SELECT * FROM users WHERE username = $1")
        .bind(username)
        .fetch_optional(pool)
        .await
    {
        Ok(user) => user,
        Err(err) => {
            error!(Category::Db, "Getting user by username failed with error: {:#?}", err);
            return Err(AppError::generic_500());
        }
    };

    Ok(user)
}

/**
 * Create new user in the db
 */
pub async fn create_user(pool: &PgPool, username: &str, password_hash: &str) -> Result<(), AppError> {
    match sqlx::query("INSERT INTO users (username, password_hash) VALUES ($1, $2)")
        .bind(username)
        .bind(password_hash)
        .execute(pool)
        .await
    {
        Ok(_) => Ok(()),
        Err(err) => {
            error!(
                Category::Db,
                "Sql query for creating user failed with error: {:#?}", err
            );
            Err(AppError::generic_500())
        }
    }
}

/**
 * Update last login to now
 */
pub async fn update_last_login_to_now(pool: &PgPool, username: &str) -> Result<(), AppError> {
    match sqlx::query("UPDATE users SET last_login_at = NOW() WHERE username = $1")
        .bind(username)
        .execute(pool)
        .await
    {
        Ok(_) => Ok(()),
        Err(err) => {
            error!(Category::Db, "Updating user last login failed with error: {:#?}", err);
            Err(AppError::generic_500())
        }
    }
}
