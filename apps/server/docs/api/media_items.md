# Media Items API

All endpoints are relative to `/api`, require an authenticated session, and scope
data to the current user.

## Endpoints

### Get custom lists of media item

`GET /media-items/custom-lists`

Returns all custom lists the media item is part of.

The media item is identified by these query parameters:

`?kind=movie&external_source=tmdb&external_id=603`

- **Success:** `200 OK`
- **Response:** `CustomListResponse[]`

```json
[
	{
		"id": 1,
		"name": "Watch later",
		"created_at": "2026-01-01T12:00:00Z",
		"updated_at": "2026-01-01T12:00:00Z",
		"preview_posters": [
			"/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
			"/8xEVAe84zlL9rkfYT6dZXero4KK.jpg"
		]
	}
]
```

## Response models

### CustomListResponse

| Field | Type | Description |
| --- | --- | --- |
| `id` | `i64` | Unique list identifier |
| `name` | `String` | List name |
| `created_at` | `String` | Creation timestamp in RFC3339 format |
| `updated_at` | `String` | Last update timestamp in RFC3339 format |
| `preview_posters` | `Vec<String>` | List of the first 4 media items poster paths |
