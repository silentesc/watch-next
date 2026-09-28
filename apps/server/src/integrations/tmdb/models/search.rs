use serde::{Deserialize, Serialize, ser::Serializer};

use crate::integrations::tmdb::models::{common::PersonOverview, movies::MovieOverview, tv_series::TvSeriesOverview};

#[derive(Deserialize)]
#[serde(tag = "media_type")]
pub enum MultiSearchResult {
    #[serde(rename = "movie")]
    Movie(MovieOverview),
    #[serde(rename = "tv")]
    Tv(TvSeriesOverview),
    #[serde(rename = "person")]
    Person(PersonOverview),
}

impl Serialize for MultiSearchResult {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut result = match self {
            MultiSearchResult::Movie(movie_overview) => serde_json::to_value(movie_overview),
            MultiSearchResult::Tv(tv_series_overview) => serde_json::to_value(tv_series_overview),
            MultiSearchResult::Person(person_overview) => serde_json::to_value(person_overview),
        }
        .map_err(serde::ser::Error::custom)?;

        result
            .as_object_mut()
            .ok_or_else(|| serde::ser::Error::custom("multi-search result must serialize as a JSON object"))?
            .insert(
                "media_type".to_string(),
                serde_json::Value::String(self.as_str().to_string()),
            );

        result.serialize(serializer)
    }
}

impl MultiSearchResult {
    pub fn as_str(&self) -> &str {
        match self {
            MultiSearchResult::Movie(_) => "movie",
            MultiSearchResult::Tv(_) => "tv",
            MultiSearchResult::Person(_) => "person",
        }
    }

    pub fn get_media_id(&self) -> Option<i64> {
        match self {
            MultiSearchResult::Movie(movie_overview) => movie_overview.id,
            MultiSearchResult::Tv(tv_series_overview) => tv_series_overview.id,
            MultiSearchResult::Person(person_overview) => person_overview.id,
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
                {"media_type":"person","id":1,"name":"Mark Hamill","known_for":[]}
            ]"#,
        )
        .expect("mixed search results should deserialize");

        assert!(matches!(
            results.as_slice(),
            [
                MultiSearchResult::Movie(_),
                MultiSearchResult::Tv(_),
                MultiSearchResult::Person(_),
            ]
        ));

        let serialized = serde_json::to_value(&results).expect("mixed search results should serialize");
        assert_eq!(serialized[0]["media_type"], "movie");
        assert_eq!(serialized[1]["media_type"], "tv");
        assert_eq!(serialized[2]["media_type"], "person");
    }
}
