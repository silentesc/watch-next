use axum_extra::extract::cookie::{Cookie, SameSite};
use time::{Duration, OffsetDateTime};

use crate::app::constants;

pub fn removal_cookie<'a>(cookie_name: String) -> Cookie<'a> {
    Cookie::build((cookie_name, ""))
        .http_only(true)
        .path("/")
        .same_site(SameSite::Strict)
        .secure(true)
        .max_age(Duration::ZERO)
        .build()
}

pub fn default_cookie<'a>(session_id: String, expires: OffsetDateTime) -> Cookie<'a> {
    Cookie::build((constants::SESSION_ID_COOKIE_NAME, session_id))
        .http_only(true)
        .path("/")
        .same_site(SameSite::Strict)
        .expires(expires)
        .secure(true)
        .build()
}

pub fn session_expiration() -> OffsetDateTime {
    OffsetDateTime::now_utc() + Duration::days(constants::SESSION_EXPIRATION_DAYS.into())
}
