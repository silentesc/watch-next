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
    environment:
      TZ: Etc/UTC
      POSTGRES_USER: watch_next
      POSTGRES_PASSWORD: watch_next
      POSTGRES_DB: watch_next
    volumes:
      - ./data/postgres:/var/lib/postgresql
    restart: unless-stopped

  watch-next:
    image: watch-next
    ports:
      - 5657:5657
    environment:
      TZ: Etc/UTC
      TMDB_API_KEY: your-tmdb-key
    volumes:
      - ./data/watch-next:/app/data
    restart: unless-stopped
    depends_on:
      - watch-next-postgres
```

#### Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `TMDB_API_KEY` | - | You can create a free TMDB account to get one |
| `TZ` | `Etc/UTC` | Your timezone |
| `LOG_LEVEL` | `INFO` | Accepts `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `SERVE_ADDR` | `0.0.0.0:5657` | Address/Port the app listens on |
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` | URL of the TMDB API |
| `TMDB_CACHE_TTL_MINUTES` | `60` | How many minutes to keep stuff retrieved from TMDB in cache |
| `ALLOW_REGISTRATION` | `true` | Whether to allow registrations of new users |
| `POSTGRES_URI` | `postgres://watch_next:watch_next@watch-next-postgres:5432/watch_next` | URI to the postgres database |
| `DATA_DIR` | `/app/data` | Directory where app data (like secret keys generated on first startup) is stored |

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
