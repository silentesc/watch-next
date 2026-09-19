use serde::Serialize;
use time::OffsetDateTime;
use uuid::Uuid;

use crate::persistence::models::User;

#[derive(Serialize)]
pub struct MeResponse {
    pub id: Uuid,
    pub username: String,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
    #[serde(with = "time::serde::rfc3339::option")]
    pub last_login_at: Option<OffsetDateTime>,
}

impl From<User> for MeResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            username: user.username,
            created_at: user.created_at,
            last_login_at: user.last_login_at,
        }
    }
}
