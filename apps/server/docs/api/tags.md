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

`GET /tags/:tag_id/items`

- **Success:** `200 OK`
- **Response:** `MediaItemTree[]`
- **Errors:** `404 Not Found` if the tag is not found for the user

### Tag an item

`POST /tags/:tag_id/items`

```json
{
	"kind": "movie",
	"external_source": "tmdb",
	"external_id": 603,
	"season_number": 1,  // optional
	"episode_number": 1  // optional
}
```

- **Success:** `201 Created`
- **Errors:** `400 Bad Request` if the media item is invalid or the item is already tagged with this tag; `404 Not Found` if the tag is not found for the user or the item does not exist

### Untag an item

`DELETE /tags/:tag_id/items`

The tag ID is taken from the path. The media item is identified by these query parameters:

`?kind=movie&external_source=tmdb&external_id=603&season_number=1&episode_number=1`

> [!NOTE]
> `season_number` and `episode_number` are optional

- **Success:** `204 No Content`
- **Errors:** `404 Not Found` if the tag or media item does not exist or media item is not tagged with that tag

## Response models

### TagResponse

| Field | Type | Description |
| --- | --- | --- |
| `id` | `i64` | Unique tag identifier |
| `name` | `String` | Tag name |
| `created_at` | `String` | Creation timestamp in RFC3339 format |
| `updated_at` | `String` | Last update timestamp in RFC3339 format |

### MediaItemTree

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `String` | Media type, such as `collection`, `movie`, `tv_series`, `tv_season`, `tv_episode` |
| `title` | `Option<String>` | Title of the item if any |
| `poster_path` | `Option<String>` | Poster path of the item in the known format of the external source if any |
| `release_date` | `Option<String>` | Release date formatted in the known format of the external source if any |
| `external_source` | `String` | External provider, such as `tmdb` |
| `external_id` | `i32` | Provider's media identifier |
| `parent` | `Option<MediaItemTree>` | Parent of the item (e.g. episode has season as parent) |
| `season_number` | `Option<i32>` | Season number if kind is `tv_season` |
| `episode_number` | `Option<i32>` | Episode number if kind is `tv_episode` |
