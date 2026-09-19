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

#[cfg(test)]
mod tests {
    use super::{default_cookie, removal_cookie};
    use crate::app::constants;
    use axum_extra::extract::cookie::SameSite;
    use time::{Duration, OffsetDateTime};

    #[test]
    fn default_cookie_contains_secure_session_settings() {
        let expiration = OffsetDateTime::now_utc() + Duration::days(7);
        let cookie = default_cookie(String::from("session-id"), expiration);

        assert_eq!(cookie.name(), constants::SESSION_ID_COOKIE_NAME);
        assert_eq!(cookie.value(), "session-id");
        assert!(cookie.http_only().is_some_and(|value| value));
        assert_eq!(cookie.path(), Some("/"));
        assert_eq!(cookie.same_site(), Some(SameSite::Strict));
        assert!(cookie.secure().is_some_and(|value| value));
        assert!(cookie.expires().is_some());
    }

    #[test]
    fn removal_cookie_expires_the_session_cookie() {
        let cookie = removal_cookie(String::from(constants::SESSION_ID_COOKIE_NAME));

        assert_eq!(cookie.name(), constants::SESSION_ID_COOKIE_NAME);
        assert_eq!(cookie.value(), "");
        assert_eq!(cookie.max_age(), Some(Duration::ZERO));
        assert!(cookie.http_only().is_some_and(|value| value));
        assert!(cookie.secure().is_some_and(|value| value));
    }
}
