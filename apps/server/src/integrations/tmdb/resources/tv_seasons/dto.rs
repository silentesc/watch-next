use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct TvSeasonDetailsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub append_to_response: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}
