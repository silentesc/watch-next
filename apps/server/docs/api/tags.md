# Tags API

All endpoints are relative to `/api`, require an authenticated session, and scope
data to the current user.

## Endpoints

### Get all tags

`GET /tags`

Returns the current user's tags.

- **Success:** `200 OK`
- **Response:** `TagResponse[]`

```json
[
	{
		"id": 1,
		"name": "Favorite",
		"created_at": "2026-01-01T12:00:00Z",
		"updated_at": "2026-01-01T12:00:00Z"
	}
]
```

### Create a tag

`POST /tags`

```json
{ "name": "Favorite" }
```

- The name is trimmed before validation and storage.
- The trimmed name must contain between 1 and 30 characters.
- **Success:** `201 Created`
- **Response:** `{ "id": 1 }`
- **Errors:** `400 Bad Request` if the name is invalid or the user already has a tag with that name

### Update a tag

`PUT /tags/:tag_id`

```json
{ "name": "Rewatch" }
```

- The name is trimmed before validation and storage.
- The trimmed name must contain between 1 and 30 characters.
- **Success:** `204 No Content`
- **Errors:** `400 Bad Request` if the name is invalid or the user already has a tag with that name; `404 Not Found` if the tag does not belong to the user

### Delete a tag

`DELETE /tags/:tag_id`

- **Success:** `204 No Content`
- **Errors:** `404 Not Found` if the tag is not found for the user

### Get items tagged with a specific tag

Get all items

`GET /tags/:tag_id/items`

Filter for items in all lists (AND logic)

`GET /tags/:tag_id/items?list_ids=1,2,4`

Filter for items in any list (OR logic)

`GET /tags/:tag_id/items?list_ids=1|2|4`

Filter by tags using the same comma-for-AND and pipe-for-OR syntax:

`GET /tags/:tag_id/items?tag_ids=1,2`

Both `list_ids` and `tag_ids` can be provided; the item must satisfy both filters.

`GET /tags/:tag_id/items?list_ids=1,2&tag_ids=3|4`

- **Success:** `200 OK`
- **Response:** `MediaItem[]`
- **Errors:** `400 Bad Request` if either ID filter is invalid or mixes separators; `404 Not Found` if the tag is not found for the user

### Tag items

`POST /tags/:tag_id/items`

```json
{
	"items": [
		{
			"kind": "movie",
			"external_source": "tmdb",
			"external_id": 603
		},
		{
			"kind": "tv_series",
			"external_source": "tmdb",
			"external_id": 1399
		}
	]
}
```

- **Success:** `201 Created`
- Items already tagged with this tag are skipped; new items in the same batch are still tagged.
- **Errors:** `400 Bad Request` if the media item is invalid; `404 Not Found` if the tag is not found for the user or the item does not exist

### Untag items

`DELETE /tags/:tag_id/items`

The tag ID is taken from the path. The request body contains the media items to untag:

```json
{
	"items": [
		{
			"kind": "movie",
			"external_source": "tmdb",
			"external_id": 603
		},
		{
			"kind": "tv_series",
			"external_source": "tmdb",
			"external_id": 1399
		}
	]
}
```

- **Success:** `204 No Content` when all requested items are untagged
- **Errors:** `404 Not Found` if the tag does not belong to the user or any item does not have this tag; no items are removed if the batch fails

## Response models

### TagResponse

| Field | Type | Description |
| --- | --- | --- |
| `id` | `i64` | Unique tag identifier |
| `name` | `String` | Tag name |
| `created_at` | `String` | Creation timestamp in RFC3339 format |
| `updated_at` | `String` | Last update timestamp in RFC3339 format |

### MediaItem

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `String` | Media type, such as `collection`, `movie`, `tv_series` |
| `title` | `Option<String>` | Title of the item if any |
| `poster_path` | `Option<String>` | Poster path of the item in the known format of the external source if any |
| `release_date` | `Option<String>` | Release date formatted in the known format of the external source if any |
| `external_source` | `String` | External provider, such as `tmdb` |
| `external_id` | `i32` | Provider's media identifier |
