use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Language {
    pub iso_639_1: Option<String>,
    pub english_name: Option<String>,
    pub name: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Genre {
    pub id: Option<i64>,
    pub name: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Cast {
    pub adult: Option<bool>,
    pub gender: Option<i32>,
    pub id: Option<i64>,
    pub known_for_department: Option<String>,
    pub name: Option<String>,
    pub original_name: Option<String>,
    pub popularity: Option<f64>,
    pub profile_path: Option<String>,
    pub cast_id: Option<i64>,
    pub character: Option<String>,
    pub credit_id: Option<String>,
    pub order: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct Crew {
    pub adult: Option<bool>,
    pub gender: Option<i32>,
    pub id: Option<i64>,
    pub known_for_department: Option<String>,
    pub name: Option<String>,
    pub original_name: Option<String>,
    pub popularity: Option<f64>,
    pub profile_path: Option<String>,
    pub credit_id: Option<String>,
    pub department: Option<String>,
    pub job: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Country {
    pub iso_3166_1: Option<String>,
    pub name: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ReleaseDate {
    pub certification: Option<String>,
    pub descriptors: Option<Vec<String>>,
    pub iso_639_1: Option<String>,
    pub note: Option<String>,
    pub release_date: Option<String>,
    #[serde(rename = "type")]
    pub release_type: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct Video {
    pub iso_639_1: Option<String>,
    pub iso_3166_1: Option<String>,
    pub name: Option<String>,
    pub key: Option<String>,
    pub site: Option<String>,
    pub size: Option<i32>,
    #[serde(rename = "type")]
    pub video_type: Option<String>,
    pub official: Option<bool>,
    pub published_at: Option<String>,
    pub id: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub enum TimeWindow {
    #[serde(rename = "day")]
    Day,
    #[serde(rename = "week")]
    Week,
}

impl TimeWindow {
    pub fn from_str(s: &str) -> Self {
        match s {
            "day" => TimeWindow::Day,
            "week" => TimeWindow::Week,
            _ => TimeWindow::Day,
        }
    }
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Day => "day",
            Self::Week => "week",
        }
    }
}
