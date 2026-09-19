use axum::{Router, middleware::from_fn_with_state};
use tokio::net::TcpListener;
#[cfg(unix)]
use tokio::signal::unix::{SignalKind, signal};
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
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap_or_else(|err| panic!("App should be served: {:#?}", err));
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c().await.expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal(SignalKind::terminate())
            .expect("failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}

#[cfg(test)]
mod tests {
    use axum::{body::Body, http::Request};
    use axum_extra::extract::cookie::Key;
    use sqlx::postgres::PgPoolOptions;
    use tower::ServiceExt;

    use super::setup_router;
    use crate::{
        app::state::AppState,
        integrations::tmdb::{TmdbApi, client::TmdbClient},
    };

    fn test_state() -> AppState {
        let pool = PgPoolOptions::new()
            .connect_lazy("postgres://test:test@localhost/test")
            .expect("test pool should be constructible");
        let tmdb_client = TmdbClient::new(pool.clone(), String::from("http://127.0.0.1"), String::from("test"), 5)
            .expect("test TMDB client should be constructible");

        AppState {
            pool,
            tmdb: TmdbApi::new(tmdb_client),
            key: Key::generate(),
            allow_registration: true,
        }
    }

    #[tokio::test]
    async fn protected_api_routes_reject_requests_without_authentication() {
        let protected_paths = [
            "/api/me",
            "/api/configuration/languages",
            "/api/genre/movie/list",
            "/api/discover/movie",
            "/api/discover/tv",
            "/api/tv/1/season/1",
            "/api/search/collection",
        ];

        for path in protected_paths {
            let response = setup_router(test_state())
                .oneshot(Request::get(path).body(Body::empty()).unwrap())
                .await
                .unwrap();

            assert_eq!(response.status(), axum::http::StatusCode::UNAUTHORIZED, "{path}");
        }
    }

    #[tokio::test]
    async fn public_root_route_does_not_require_authentication() {
        let response = setup_router(test_state())
            .oneshot(Request::get("/api").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), axum::http::StatusCode::OK);
    }

    #[tokio::test]
    async fn protected_api_routes_reject_unsigned_session_cookies() {
        let response = setup_router(test_state())
            .oneshot(
                Request::get("/api/me")
                    .header("cookie", "session_id=not-a-signed-cookie")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), axum::http::StatusCode::UNAUTHORIZED);
    }
}
