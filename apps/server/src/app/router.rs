use std::env;

use axum::{
    Router,
    http::{HeaderValue, Method, header},
    middleware::from_fn_with_state,
};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

use crate::{app::state::AppState, features, http::middleware};

pub fn setup_router(app_state: AppState) -> Router {
    let origins = env::var("CORS_ALLOWED_ORIGINS").expect("CORS_ALLOWED_ORIGINS env variable should be set by dotenv");
    let origins: Vec<HeaderValue> = origins
        .split(",")
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .map(|s| s.parse().map_err(|_| format!("Invalid origin: {}", s)))
        .collect::<Result<Vec<_>, _>>()
        .expect("One or more origins were invalid");

    let cors = CorsLayer::new()
        .allow_origin(origins)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_credentials(true);

    let protected_routes = Router::new()
        .merge(features::me::routes::router())
        .merge(features::genres::routes::router())
        .merge(features::configuration::routes::router())
        .merge(features::movies::routes::router())
        .merge(features::tv_series::routes::router())
        .merge(features::tv_seasons::routes::router())
        .merge(features::collections::routes::router())
        .layer(from_fn_with_state(
            app_state.clone(),
            middleware::auth::validate_session,
        ));

    features::root::routes::router()
        .merge(features::auth::routes::router())
        .merge(protected_routes)
        .with_state(app_state)
        .layer(cors)
}

pub async fn setup_tcp_listener(addr: &str) -> TcpListener {
    TcpListener::bind(addr)
        .await
        .unwrap_or_else(|err| panic!("Listener should bind to {}: {:#?}", addr, err))
}

pub async fn serve(listener: TcpListener, router: Router) {
    axum::serve(listener, router)
        .await
        .unwrap_or_else(|err| panic!("App should be served: {:#?}", err));
}
