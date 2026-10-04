use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::people::PersonCombinedCredit;

#[derive(Serialize, Deserialize)]
pub struct PersonDetailsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub append_to_response: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct PersonCombinedCreditsParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct PersonCombinedCreditsResponse {
    pub cast: Vec<PersonCombinedCredit>,
    pub crew: Vec<PersonCombinedCredit>,
    pub id: i64,
}
