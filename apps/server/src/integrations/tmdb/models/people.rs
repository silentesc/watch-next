use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PersonDetails {
    pub adult: Option<bool>,
    pub also_known_as: Option<Vec<String>>,
    pub biography: Option<String>,
    pub birthday: Option<String>,
    pub deathday: Option<String>,
    pub gender: Option<i32>,
    pub homepage: Option<String>,
    pub id: Option<i64>,
    pub imdb_id: Option<String>,
    pub known_for_department: Option<String>,
    pub name: Option<String>,
    pub place_of_birth: Option<String>,
    pub popularity: Option<f64>,
    pub profile_path: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct PersonMovieCredit {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub character: Option<String>,
    pub credit_id: Option<String>,
    pub department: Option<String>,
    pub genre_ids: Option<Vec<i64>>,
    pub id: Option<i64>,
    pub order: Option<i64>,
    pub original_language: Option<String>,
    pub original_title: Option<String>,
    pub overview: Option<String>,
    pub popularity: Option<f64>,
    pub poster_path: Option<String>,
    pub release_date: Option<String>,
    pub title: Option<String>,
    pub video: Option<bool>,
    pub job: Option<String>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct PersonTvCredit {
    pub adult: Option<bool>,
    pub backdrop_path: Option<String>,
    pub character: Option<String>,
    pub credit_id: Option<String>,
    pub department: Option<String>,
    pub episode_count: Option<i64>,
    pub first_air_date: Option<String>,
    pub genre_ids: Option<Vec<i64>>,
    pub id: Option<i64>,
    pub name: Option<String>,
    pub origin_country: Option<Vec<String>>,
    pub original_language: Option<String>,
    pub original_name: Option<String>,
    pub overview: Option<String>,
    pub popularity: Option<f64>,
    pub poster_path: Option<String>,
    pub job: Option<String>,
    pub vote_average: Option<f64>,
    pub vote_count: Option<i64>,
}

#[derive(Deserialize)]
#[serde(tag = "media_type")]
pub enum PersonCombinedCredit {
    #[serde(rename = "movie")]
    Movie(PersonMovieCredit),
    #[serde(rename = "tv")]
    Tv(PersonTvCredit),
}

impl PersonCombinedCredit {
    pub fn as_str(&self) -> &str {
        match self {
            PersonCombinedCredit::Movie(_) => "movie",
            PersonCombinedCredit::Tv(_) => "tv",
        }
    }

    pub fn get_media_id(&self) -> Option<i64> {
        match self {
            PersonCombinedCredit::Movie(movie_overview) => movie_overview.id,
            PersonCombinedCredit::Tv(tv_series_overview) => tv_series_overview.id,
        }
    }
}

impl Serialize for PersonCombinedCredit {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut result = match self {
            PersonCombinedCredit::Movie(person_movie_credit) => serde_json::to_value(person_movie_credit),
            PersonCombinedCredit::Tv(person_tv_credit) => serde_json::to_value(person_tv_credit),
        }
        .map_err(serde::ser::Error::custom)?;

        result
            .as_object_mut()
            .ok_or_else(|| serde::ser::Error::custom("person combined credit result must serialize as a JSON object"))?
            .insert(
                "media_type".to_string(),
                serde_json::Value::String(self.as_str().to_string()),
            );

        result.serialize(serializer)
    }
}

#[cfg(test)]
mod tests {
    use super::PersonCombinedCredit;

    #[test]
    fn deserializes_mixed_results() {
        let results: Vec<PersonCombinedCredit> = serde_json::from_str(
            r#"[
                {"media_type":"movie","id":11,"title":"Star Wars"},
                {"media_type":"tv","id":83867,"name":"Andor"}
            ]"#,
        )
        .expect("person combined credit results should deserialize");

        assert!(matches!(
            results.as_slice(),
            [PersonCombinedCredit::Movie(_), PersonCombinedCredit::Tv(_),]
        ));

        let serialized = serde_json::to_value(&results).expect("person combined credit results should serialize");
        assert_eq!(serialized[0]["media_type"], "movie");
        assert_eq!(serialized[1]["media_type"], "tv");
    }
}
