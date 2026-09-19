use axum::{Router, middleware::from_fn_with_state};
use tokio::net::TcpListener;
use tower_http::services::{ServeDir, ServeFile};

use crate::{app::state::AppState, features, http::middleware};

pub fn setup_router(app_state: AppState) -> Router {
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

    let api_routes = Router::new()
        .merge(features::root::routes::router())
        .merge(features::auth::routes::router())
        .merge(protected_routes);

    let api = Router::new().nest("/api", api_routes).with_state(app_state);

    let frontend = ServeDir::new("/app/web").fallback(ServeFile::new("/app/web/index.html"));

    Router::new().merge(api).fallback_service(frontend)
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
