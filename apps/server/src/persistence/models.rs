use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use time::OffsetDateTime;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub password_hash: String,
    pub created_at: OffsetDateTime,
    pub last_login_at: Option<OffsetDateTime>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub expires_at: OffsetDateTime,
}
