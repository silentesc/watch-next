use axum::http::StatusCode;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    app::errors::AppError, features::me::dto::MeResponse, logger::enums::category::Category,
    persistence::table_utils::users, warn,
};

pub async fn me(pool: &PgPool, user_id: Uuid) -> Result<MeResponse, AppError> {
    let user = match users::get_user_by_id(pool, user_id).await {
        Ok(user) => user,
        Err(app_error) => return Err(app_error),
    };

    match user {
        Some(user) => Ok(user.into()),
        None => {
            warn!(Category::Me, "User with id {} doesn't exist", user_id.to_string());
            Err(AppError::new(
                StatusCode::NOT_FOUND,
                String::from("User does not exist"),
            ))
        }
    }
}
