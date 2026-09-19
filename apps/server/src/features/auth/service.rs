use crate::{
    app::{constants, errors::AppError},
    error, info,
    logger::enums::category::Category,
    persistence::table_utils::{sessions, users},
    utils::cookie_utils,
};
use axum::http::StatusCode;
use axum_extra::extract::SignedCookieJar;
use regex::Regex;
use sqlx::PgPool;

pub async fn register(pool: &PgPool, username: String, password: String) -> Result<(), AppError> {
    validate_username(&username)?;

    // Check if username is already used
    match users::get_user_by_username(pool, &username).await {
        Ok(user) => {
            if user.is_some() {
                return Err(AppError::new(
                    StatusCode::BAD_REQUEST,
                    String::from("Username is already taken"),
                ));
            }
        }
        Err(app_error) => return Err(app_error),
    };

    // Hash password
    let password_hashed = match bcrypt::hash(password, bcrypt::DEFAULT_COST) {
        Ok(password_hashed) => password_hashed,
        Err(err) => {
            error!(Category::Register, "Bcrypt hash failed with error: {:#?}", err);
            return Err(AppError::generic_500());
        }
    };

    // Create user in db
    match users::create_user(pool, &username, &password_hashed).await {
        Ok(()) => {
            info!(Category::Register, "User registered: {}", username);
            Ok(())
        }
        Err(app_error) => Err(app_error),
    }
}

fn validate_username(username: &str) -> Result<(), AppError> {
    if username.len() < 4 || username.len() > 30 {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Username length must be between 4 and 30"),
        ));
    }

    let re = Regex::new(r"^\w+$").map_err(|err| {
        error!(Category::Register, "Regex failed with error: {:#?}", err);
        AppError::generic_500()
    })?;

    if !re.is_match(username) {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            String::from("Username must only contain alphanumeric characters"),
        ));
    }

    Ok(())
}

pub async fn login(
    pool: &PgPool,
    jar: SignedCookieJar,
    username: String,
    password: String,
) -> Result<SignedCookieJar, AppError> {
    // Get user by username
    let db_user = match users::get_user_by_username(pool, &username).await {
        Ok(db_user) => db_user,
        Err(app_error) => return Err(app_error),
    };

    // Check if user exists
    let db_user = match db_user {
        Some(db_user) => db_user,
        None => return Err(AppError::invalid_credentials()),
    };

    // Check if user password matches
    let verified = match bcrypt::verify(&password, &db_user.password_hash) {
        Ok(verified) => verified,
        Err(err) => {
            error!(
                Category::Login,
                "Verifying password with bcrypt failed with error: {:#?}", err
            );
            return Err(AppError::generic_500());
        }
    };
    if !verified {
        return Err(AppError::invalid_credentials());
    }

    // Create session
    let session_expiration = cookie_utils::session_expiration();
    let session_token = match sessions::create_session(pool, db_user.id, session_expiration).await {
        Ok(session_token) => session_token,
        Err(app_error) => return Err(app_error),
    };

    // Create cookie
    let cookie = cookie_utils::default_cookie(session_token, session_expiration);
    let signed_cookie_jar = jar.add(cookie);

    // Set last login
    match users::update_last_login_to_now(pool, &db_user.username).await {
        Ok(_) => info!(Category::Login, "User logged in: {}", username),
        Err(app_error) => return Err(app_error),
    };

    Ok(signed_cookie_jar)
}

pub async fn logout(pool: &PgPool, jar: SignedCookieJar) -> Result<SignedCookieJar, AppError> {
    // Get session token from cookie and delete session in db
    if let Some(cookie) = jar.get(constants::SESSION_ID_COOKIE_NAME) {
        sessions::delete_session(pool, cookie.value()).await?;
    }

    // Add remove cookie
    let signed_cookie_jar = jar.add(cookie_utils::removal_cookie(String::from(
        constants::SESSION_ID_COOKIE_NAME,
    )));

    Ok(signed_cookie_jar)
}

#[cfg(test)]
mod tests {
    use super::validate_username;
    use axum::http::StatusCode;

    #[test]
    fn accepts_usernames_in_the_supported_format() {
        assert!(validate_username("watch_next").is_ok());
        assert!(validate_username("a".repeat(30).as_str()).is_ok());
    }

    #[test]
    fn rejects_usernames_outside_the_supported_length() {
        let too_short = validate_username("abc").unwrap_err();
        let too_long = validate_username("a".repeat(31).as_str()).unwrap_err();

        assert_eq!(too_short.status_code, StatusCode::BAD_REQUEST);
        assert_eq!(too_short.message, "Username length must be between 4 and 30");
        assert_eq!(too_long.status_code, StatusCode::BAD_REQUEST);
        assert_eq!(too_long.message, "Username length must be between 4 and 30");
    }

    #[test]
    fn rejects_usernames_with_non_word_characters() {
        let error = validate_username("watch-next").unwrap_err();

        assert_eq!(error.status_code, StatusCode::BAD_REQUEST);
        assert_eq!(error.message, "Username must only contain alphanumeric characters");
    }
}
