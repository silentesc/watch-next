use std::time::Duration;

use axum::http::{HeaderMap, HeaderValue};
use reqwest::{
    Client as HttpClient,
    header::{ACCEPT, AUTHORIZATION},
};
use serde::{Serialize, de::DeserializeOwned};
use sqlx::PgPool;

use crate::{
    integrations::tmdb::errors::TmdbError, logger::enums::category::Category, persistence::table_utils::cache, trace,
};

#[derive(Clone)]
pub struct TmdbClient {
    pool: PgPool,
    http_client: HttpClient,
    base_url: String,
    tmdb_cache_ttl_minutes: i64,
}

impl TmdbClient {
    pub fn new(
        pool: PgPool,
        base_url: String,
        access_token: String,
        tmdb_cache_ttl_minutes: i64,
    ) -> Result<Self, TmdbError> {
        let mut headers = HeaderMap::new();
        headers.append(
            AUTHORIZATION,
            HeaderValue::try_from(format!("Bearer {access_token}"))
                .map_err(|err| TmdbError::InvalidConfiguration { error: err.to_string() })?,
        );
        headers.append(ACCEPT, HeaderValue::from_static("application/json"));

        let http_client = HttpClient::builder()
            .timeout(Duration::from_secs(10))
            .connect_timeout(Duration::from_secs(10))
            .default_headers(headers)
            .build()
            .map_err(|err| TmdbError::Http { error: err.to_string() })?;

        Ok(Self {
            pool,
            http_client,
            base_url,
            tmdb_cache_ttl_minutes,
        })
    }

    pub async fn get<T, Q>(&self, endpoint: &str, query: &Q) -> Result<T, TmdbError>
    where
        T: DeserializeOwned + Serialize,
        Q: Serialize + ?Sized,
    {
        let query_string = serde_json::to_string(query).map_err(|err| TmdbError::Json { error: err.to_string() })?;
        let cache_key = format!("{endpoint}?{query_string}");

        if let Some(cached) = self.get_cached(&cache_key).await? {
            trace!(Category::Tmdb, "Retrieved from cache for: {:#?}", endpoint);
            return Ok(cached);
        }

        let result: T = self.get_tmdb(endpoint, query).await?;

        cache::set(
            &self.pool,
            &cache_key,
            &result,
            time::OffsetDateTime::now_utc() + time::Duration::minutes(self.tmdb_cache_ttl_minutes),
        )
        .await
        .map_err(|err| TmdbError::Db { error: err.message })?;

        trace!(Category::Tmdb, "Retrieved & cached from TMDB for: {:#?}", endpoint);

        Ok(result)
    }

    async fn get_tmdb<T, Q>(&self, endpoint: &str, query: &Q) -> Result<T, TmdbError>
    where
        T: DeserializeOwned,
        Q: Serialize + ?Sized,
    {
        let endpoint_url = format!("{}{}", self.base_url, endpoint);

        let response = self
            .http_client
            .get(endpoint_url)
            .query(query)
            .send()
            .await
            .map_err(|err| TmdbError::Http { error: err.to_string() })?;

        let status = response.status();

        if !status.is_success() {
            let body = response.text().await.unwrap_or_default();
            return Err(TmdbError::Api { status, body });
        }

        response
            .json()
            .await
            .map_err(|err| TmdbError::Json { error: err.to_string() })
    }

    async fn get_cached<T>(&self, cache_key: &str) -> Result<Option<T>, TmdbError>
    where
        T: DeserializeOwned,
    {
        cache::get(&self.pool, cache_key)
            .await
            .map_err(|err| TmdbError::Db { error: err.message })
    }
}
