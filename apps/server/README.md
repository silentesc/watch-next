# Watch Next

## Endpoints

### TMDB Endpoints

Necessary TMDB endpoints are implemented and can be used exactly like the original endpoints.

| Category | Endpoints |
| --- | --- |
| Genre | <ul><li>[Movie](https://developer.themoviedb.org/reference/genre-movie-list)</li><li>[TV](https://developer.themoviedb.org/reference/genre-tv-list)</li></ul> |
| Configuration | <ul><li>[Languages](https://developer.themoviedb.org/reference/configuration-languages)</li></ul> |
| Movies | <ul><li>[Details](https://developer.themoviedb.org/reference/movie-details)</li><li>[Release Dates](https://developer.themoviedb.org/reference/movie-release-dates)</li><li>[Credits](https://developer.themoviedb.org/reference/movie-credits)</li><li>[Videos](https://developer.themoviedb.org/reference/movie-videos)</li><li>[Recommendations](https://developer.themoviedb.org/reference/movie-recommendations)</li><li>[Similar](https://developer.themoviedb.org/reference/movie-similar)</li><li>[Discover](https://developer.themoviedb.org/reference/discover-movie)</li><li>[Trending](https://developer.themoviedb.org/reference/trending-movies)</li><li>[Search](https://developer.themoviedb.org/reference/search-movie)</li></ul> |
| TV Series | <ul><li>[Details](https://developer.themoviedb.org/reference/tv-series-details)</li><li>[Aggregate Credits](https://developer.themoviedb.org/reference/tv-series-aggregate-credits)</li><li>[Videos](https://developer.themoviedb.org/reference/tv-series-videos)</li><li>[Recommendations](https://developer.themoviedb.org/reference/tv-series-recommendations)</li><li>[Similar](https://developer.themoviedb.org/reference/tv-series-similar)</li><li>[Discover](https://developer.themoviedb.org/reference/discover-tv)</li><li>[Trending](https://developer.themoviedb.org/reference/trending-tv)</li><li>[Search](https://developer.themoviedb.org/reference/search-tv)</li></ul> |
| TV Seasons | <ul><li>[Details](https://developer.themoviedb.org/reference/tv-season-details)</li></ul> |
| Collections | <ul><li>[Details](https://developer.themoviedb.org/reference/collection-details)</li><li>[Search](https://developer.themoviedb.org/reference/search-collection)</li></ul> |

## Roadmap

### **v1.0** (current)

  - ✅ Authentication
  - ✅ Core TMDB endpoints
  - ✅ TMDB Caching
  - 🔜 Custom Lists (e.g. Plan to Watch, Watching, Completed)
  - 🔜 Custom Tags (e.g. must-watch)

### **v1.1** (next)

- 🔜 Analytics
  - 🔜 Total hours watched
  - 🔜 Watch history
  - 🔜 Viewing patterns (e.g. favorite genres, prefer short series)
- 🔜 Notifications & Reminders
  - 🔜 New episodes
  - 🔜 Status changes

### v?.? (future)

- 🔜 Personal Recommendations (based on watch history & viewing patterns)
- 🔜 Seasonal Recommendations
- 🔜 Achievements & Leveling System
- 🔜 Configurable region, language, etc.
- 🔜 Ratings from IMDB
- 🔜 Refresh token so sessions don't expire after 7 days

## Quick Start

### Database

```yml
services:
  postgres:
    image: postgres:18
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: my_postgres_user
      POSTGRES_PASSWORD: strong_password
      POSTGRES_DB: name_of_db
      TZ: Etc/UTC
    volumes:
      - ./data/postgres:/var/lib/postgresql
    restart: unless-stopped
```

### Watch Next Backend

#### .env file
```dotenv
# TRACE, DEBUG, INFO, WARN, ERROR
LOG_LEVEL="INFO"

DATABASE_URL="postgres://my_postgres_user:strong_password@localhost/name_of_db"

SERVE_ADDR="0.0.0.0:3000"
CORS_ALLOWED_ORIGINS="http://localhost:5173,https://api.watch-next.mydomain.com"

TMDB_BASE_URL="https://api.themoviedb.org/3"
TMDB_API_KEY="abcdefghijklmnopqrstuvwxyz"
TMDB_CACHE_TTL_MINUTES=60

# Must be at least 64 characters long
# Changing key invalidates all active sessions
COOKIE_KEY="long_secret_key"

# Set to false to disable registration for new users
ALLOW_REGISTRATION="true"
```

#### Run app
```bash
cargo run
```
