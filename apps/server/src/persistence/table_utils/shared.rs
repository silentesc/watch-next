use reqwest::StatusCode;

use crate::app::errors::AppError;

#[derive(Debug, Default, PartialEq, Eq)]
pub struct IdFilter {
    pub ids: Option<Vec<i64>>,
    pub match_any: bool,
}

pub fn parse_id_filter(ids: Option<String>) -> Result<IdFilter, AppError> {
    let Some(ids) = ids.filter(|ids| !ids.is_empty()) else {
        return Ok(IdFilter::default());
    };

    let has_comma = ids.contains(',');
    let match_any = ids.contains('|');
    if has_comma && match_any {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            "IDs must use commas for AND or pipes for OR, not both.".to_owned(),
        ));
    }

    let separator = if match_any { '|' } else { ',' };
    let ids = ids
        .split(separator)
        .map(str::trim)
        .map(str::parse::<i64>)
        .collect::<Result<Vec<_>, _>>()
        .map_err(|_| {
            AppError::new(
                StatusCode::BAD_REQUEST,
                "IDs must be comma-separated or pipe-separated integers.".to_owned(),
            )
        })?;

    Ok(IdFilter {
        ids: Some(ids),
        match_any,
    })
}

#[cfg(test)]
mod tests {
    use reqwest::StatusCode;

    use super::{IdFilter, parse_id_filter};

    #[test]
    fn parses_comma_separated_ids_as_all() {
        assert_eq!(
            parse_id_filter(Some(String::from("1, 2,3"))).unwrap_or_else(|_| panic!("expected valid IDs")),
            IdFilter {
                ids: Some(vec![1, 2, 3]),
                match_any: false,
            }
        );
    }

    #[test]
    fn parses_pipe_separated_ids_as_any() {
        assert_eq!(
            parse_id_filter(Some(String::from("1| 2|3"))).unwrap_or_else(|_| panic!("expected valid IDs")),
            IdFilter {
                ids: Some(vec![1, 2, 3]),
                match_any: true,
            }
        );
    }

    #[test]
    fn treats_missing_and_empty_ids_as_no_filter() {
        assert_eq!(
            parse_id_filter(None).unwrap_or_else(|_| panic!("expected valid IDs")),
            IdFilter::default()
        );
        assert_eq!(
            parse_id_filter(Some(String::new())).unwrap_or_else(|_| panic!("expected valid IDs")),
            IdFilter::default()
        );
    }

    #[test]
    fn rejects_mixed_separators() {
        let error = parse_id_filter(Some(String::from("1,2|3"))).unwrap_err();

        assert_eq!(error.status_code, StatusCode::BAD_REQUEST);
        assert_eq!(error.message, "IDs must use commas for AND or pipes for OR, not both.");
    }

    #[test]
    fn rejects_non_integer_ids() {
        let error = parse_id_filter(Some(String::from("1|invalid"))).unwrap_err();

        assert_eq!(error.status_code, StatusCode::BAD_REQUEST);
        assert_eq!(error.message, "IDs must be comma-separated or pipe-separated integers.");
    }
}
