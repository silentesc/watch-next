use std::env;

use crate::{app::router::setup_tcp_listener, logger::enums::category::Category};

mod app;
mod features;
mod http;
mod integrations;
mod logger;
mod persistence;
mod utils;
mod workers;

#[tokio::main]
async fn main() {
    app::configuration::load_env();

    app::configuration::setup_logging();

    let pool = app::configuration::connect_postgres().await;
    app::configuration::check_create_tables(&pool).await;

    workers::db_cleanup::start_background_cleanup(pool.clone());

    let app_state = app::configuration::setup_app_state(pool);

    let router = app::router::setup_router(app_state);

    let addr = env::var("SERVE_ADDR").expect("SERVE_ADDR env variable should be set by dotenv");
    let listener = setup_tcp_listener(&addr).await;

    info!(Category::Setup, "Listening on {}", addr);
    app::router::serve(listener, router).await;

    info!(Category::Setup, "Shutdown");
}
