# WatchNext

A fast and lightweight watchlist app for your media, with discovery, custom lists, and more.

## Features

- Discovery & search of media, including movies, collections and shows.
- Detailed information about media, pulled from TMDB.
- Custom lists you can create to store the media where it belongs.
- Mobile friendly design.
- Built with performance in mind, on both client and server side.

Look at the [Roadmap](#roadmap) below to see upcoming features.

## Quick Start

### Docker Compose

```yml
services:
  watch-next-postgres:
    image: postgres:18-alpine
    # Only add port mappings if the db should be accessable from outside this compose
    # ports:
    #   - 5432:5432
    environment:
      TZ: Etc/UTC
      POSTGRES_USER: <username>
      POSTGRES_PASSWORD: <password>
      POSTGRES_DB: <db_name>
    volumes:
      - ./data/postgres:/var/lib/postgresql
    restart: unless-stopped

  watch-next:
    image: watch-next
    ports:
      - 5657:5657
    environment:
      TZ: Etc/UTC
      DATABASE_URL: postgres://<username>:<password>@watch-next-postgres:5432/<db_name>
      TMDB_API_KEY: tmdb-key
      COOKIE_KEY: long-secret-key
    restart: unless-stopped
    depends_on:
      - watch-next-postgres
```

#### Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | - | URI to the postgres database |
| `TMDB_API_KEY` | - | You can create a free TMDB account to get one |
| `COOKIE_KEY` | - | A long (>64 characters) secret key |
| `TZ` | `Etc/UTC` | Your timezone |
| `LOG_LEVEL` | `INFO` | Accepts `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `SERVE_ADDR` | `0.0.0.0:5657` | Address/Port the app listens on |
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` | URL of the TMDB API |
| `TMDB_CACHE_TTL_MINUTES` | `60` | How many minutes to keep stuff retrieved from TMDB in cache |
| `ALLOW_REGISTRATION` | `true` | Whether to allow registrations of new users |

#### Release Channels

| Tag | Description |
| --- | --- |
| `latest` | Newest stable release, including major upgrades and potentially breaking changes |
| `v1.0.0` | Exact version pinned, never updates |
| `v1.0` | Minor version pinned, only updates on bugfixes |
| `v1` | Major version pinned, always updates until major version changes |

## Roadmap

Broad plan of features, might change at any time.

### **v1.0** (current)

  - [x] User accounts
  - [x] Core TMDB endpoints
  - [x] TMDB caching
  - [x] Custom lists for movies/shows
  - [ ] Custom tags for movies/shows
  - [ ] Mark movies/shows/seasons/episodes as watched

### **v1.1** (next)

- [ ] Notifications / Reminders
- [ ] Personal configurable region, language, etc.
- [ ] Refresh token so sessions don't expire after 7 days

### v?.? (future)

- [ ] Personal analytics dashboard
- [ ] Personal recommendations based on analytics
- [ ] Seasonal recommendations
- [ ] Achievements / leveling system
- [ ] Ratings from IMDB
- [ ] TVDB integration
