# Custom Lists API

All endpoints are relative to `/api`, require an authenticated session, and scope
data to the current user.

## Endpoints

### List custom lists

`GET /custom-lists`

Returns the current user's lists.

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

### Create a custom list

`POST /custom-lists`

```json
{ "name": "Watch later" }
```

- The name is trimmed before validation and storage.
- The trimmed name must contain between 1 and 60 characters.
- **Success:** `201 Created`
- **Response:** `{ "id": 1 }`
- **Errors:** `400 Bad Request` if the name is invalid or the user already has a list with that name

### Update a custom list

`PUT /custom-lists/:list_id`

```json
{ "name": "Favorites" }
```

- The name is trimmed before validation and storage.
- The trimmed name must contain between 1 and 60 characters.
- **Success:** `204 No Content`
- **Errors:** `400 Bad Request` if the name is invalid or the user already has a list with that name; `404 Not Found` if the list does not belong to the user

### Delete a custom list

`DELETE /custom-lists/:list_id`

- **Success:** `204 No Content`
- **Errors:** `404 Not Found` if the list does not belong to the user

### Get items in a custom list

`GET /custom-lists/:list_id/items`

- **Success:** `200 OK`
- **Response:** `MediaItem[]`
- **Errors:** `404 Not Found` if the list does not belong to the user

### Add an item to a custom list

`POST /custom-lists/:list_id/items`

```json
{
	"kind": "movie",
	"external_source": "tmdb",
	"external_id": 603
}
```

- **Success:** `201 Created`
- **Errors:** `400 Bad Request` if the media item kind/source/id is invalid or the item is already in the list; `404 Not Found` if the list does not belong to the user or the item does not exist

### Remove an item from a custom list

`DELETE /custom-lists/:list_id/items`

The list ID is taken from the path. The media item is identified by these query
parameters:

`?kind=movie&external_source=tmdb&external_id=603`

- **Success:** `204 No Content`
- **Errors:** `404 Not Found` if the list or media item does not exist or media item is not found in list

## Response models

### CustomListResponse

| Field | Type | Description |
| --- | --- | --- |
| `id` | `i64` | Unique list identifier |
| `name` | `String` | List name |
| `created_at` | `String` | Creation timestamp in RFC3339 format |
| `updated_at` | `String` | Last update timestamp in RFC3339 format |
| `preview_posters` | `Vec<String>` | List of the first 4 media items poster paths |

### MediaItem

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `String` | Media type, such as `collection`, `movie` or `tv_series` |
| `title` | `Option<String>` | Title of the item if any |
| `poster_path` | `Option<String>` | Poster path of the item in the known format of the external source if any |
| `release_date` | `Option<String>` | Release date formatted in the known format of the external source if any |
| `external_source` | `String` | External provider, such as `tmdb` |
| `external_id` | `i32` | Provider's media identifier |
