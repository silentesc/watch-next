use serde::{Deserialize, Serialize};

use crate::integrations::tmdb::models::{
    collections::CollectionOverview, common::PersonOverview, movies::MovieOverview, tv_series::TvSeriesOverview,
};

#[derive(Serialize, Deserialize)]
#[serde(tag = "media_type")]
pub enum MultiSearchResult {
    #[serde(rename = "movie")]
    Movie(MovieOverview),
    #[serde(rename = "tv")]
    Tv(TvSeriesOverview),
    #[serde(rename = "person")]
    Person(PersonOverview),
    #[serde(rename = "collection")]
    Collection(CollectionOverview),
}

impl MultiSearchResult {
    pub fn as_str(&self) -> &str {
        match self {
            MultiSearchResult::Movie(_) => "movie",
            MultiSearchResult::Tv(_) => "tv",
            MultiSearchResult::Person(_) => "person",
            MultiSearchResult::Collection(_) => "collection",
        }
    }

    pub fn get_media_id(&self) -> Option<i64> {
        match self {
            MultiSearchResult::Movie(movie_overview) => movie_overview.id,
            MultiSearchResult::Tv(tv_series_overview) => tv_series_overview.id,
            MultiSearchResult::Person(person_overview) => person_overview.id,
            MultiSearchResult::Collection(collection_overview) => collection_overview.id,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::MultiSearchResult;

    #[test]
    fn deserializes_mixed_results() {
        let results: Vec<MultiSearchResult> = serde_json::from_str(
            r#"[
                {"media_type":"movie","id":11,"title":"Star Wars"},
                {"media_type":"tv","id":83867,"name":"Andor"},
                {"media_type":"person","id":1,"name":"Mark Hamill","known_for":[]},
                {"media_type":"collection","id":1,"name":"Mark Hamill"}
            ]"#,
        )
        .expect("mixed search results should deserialize");

        assert!(matches!(
            results.as_slice(),
            [
                MultiSearchResult::Movie(_),
                MultiSearchResult::Tv(_),
                MultiSearchResult::Person(_),
                MultiSearchResult::Collection(_),
            ]
        ));
    }
}
