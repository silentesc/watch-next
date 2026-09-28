use std::{env, fs, path::Path, time::Duration};

use axum_extra::extract::cookie::Key;
use dotenv::dotenv;
use sqlx::{PgPool, postgres::PgPoolOptions};

use crate::{
    app::{constants, state::AppState},
    debug,
    integrations::tmdb::{TmdbApi, client::TmdbClient},
    logger::{
        Logger,
        enums::{category::Category, log_level::LogLevel},
    },
};

pub fn load_env() {
    dotenv().ok();
}

pub fn setup_logging() {
    let log_level_env = env::var("LOG_LEVEL").expect("LOG_LEVEL env variable should be set");
    let log_level = LogLevel::from_string(log_level_env.as_str()).expect("Log level env variable should be valid");
    Logger::set_log_level(&log_level);
    debug!(
        Category::Setup,
        "Logging has been setup with log level {}",
        &log_level.to_string()
    );
}

pub async fn connect_postgres() -> PgPool {
    let postgres_uri = env::var("POSTGRES_URI").expect("POSTGRES_URI env variable should be set");
    let pool = PgPoolOptions::new()
        .max_connections(constants::POSTGRES_MAX_CONNECTIONS.into())
        .acquire_timeout(Duration::from_secs(constants::POSTGRES_ACQUIRE_TIMEOUT.into()))
        .idle_timeout(Duration::from_secs(constants::POSTGRES_IDLE_TIMEOUT.into()))
        .connect(&postgres_uri)
        .await
        .expect("Postgres should connect successfully");
    debug!(Category::Setup, "Connected to postgres database successfully");
    pool
}

pub async fn check_create_tables(pool: &PgPool) {
    sqlx::raw_sql(include_str!("../persistence/create_tables.sql"))
        .execute(pool)
        .await
        .expect("persistence/create_tables.sql should be executed");
    debug!(Category::Setup, "Performed table creation check");
}

fn load_cookie_key() -> Key {
    let key_dir = env::var("DATA_DIR").expect("DATA_DIR env variable should be set");
    let key_path = Path::new(&key_dir).join(constants::COOKIE_KEY_FILE_NAME);

    match fs::read(&key_path) {
        Ok(key_bytes) => Key::from(&key_bytes),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            fs::create_dir_all(&key_dir).expect("DATA_DIR should be creatable");
            let generated_key = Key::generate();
            fs::write(key_path, generated_key.master()).expect("Cookie key file should be writable");
            generated_key
        }
        Err(error) => panic!("cookie key should be readable at {}: {error}", key_path.display()),
    }
}

pub fn setup_app_state(pool: PgPool) -> AppState {
    let tmdb_base_url = env::var("TMDB_BASE_URL").expect("TMDB_BASE_URL env variable should be set");
    let tmdb_api_key = env::var("TMDB_API_KEY").expect("TMDB_API_KEY env variable should be set");
    let tmdb_cache_ttl_minutes = env::var("TMDB_CACHE_TTL_MINUTES")
        .expect("TMDB_CACHE_TTL_MINUTES env variable should be set")
        .parse()
        .expect("TMDB_CACHE_TTL_MINUTES env variable should be of type integer");

    let tmdb_client = TmdbClient::new(pool.clone(), tmdb_base_url, tmdb_api_key, tmdb_cache_ttl_minutes)
        .expect("Reqwest client should be built");
    let tmdb = TmdbApi::new(tmdb_client);

    let key = load_cookie_key();
    let allow_registration = env::var("ALLOW_REGISTRATION")
        .expect("ALLOW_REGISTRATION env variable should be set")
        .parse()
        .expect("ALLOW_REGISTRATION env variable should be of type boolean");

    AppState {
        pool,
        tmdb,
        key,
        allow_registration,
    }
}
