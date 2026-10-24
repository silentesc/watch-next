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
    container_name: watch-next-postgres
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
    container_name: watch-next
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

### Exposing your instance to the internet

In general, this app is developed to be exposed to the internet. However, there are multiple things to take care of before exposing your instance:

- It is highly recommended to setup a reverse proxy ([example config here](deploy/nginx/watch-next.conf)) and something like [fail2ban](https://github.com/fail2ban/fail2ban) or [Crowdsec](https://github.com/crowdsecurity/crowdsec).
- If your instance is only for your friends and family, consider setting `ALLOW_REGISTRATION` to `false` to prevent people from registering.
- Follow general advice like choosing a secure password and updating the app and your system regularly.

In the future, more security focused features like 2FA will be added.

## Roadmap

Broad plan of features. No particular order. Might change at any time.

- [x] User accounts
- [x] TMDB integration
- [x] Custom lists for collections/movies/shows
- [x] Tags for collections/movies/shows/seasons/episodes
- [ ] Notifications / Reminders
- [ ] Refresh token so sessions don't expire after 7 days
- [ ] Admin Dashboard
- [ ] Two Factor Authentication
- [ ] Personal analytics dashboard
- [ ] Personal recommendations based on analytics
- [ ] Seasonal recommendations
- [ ] Achievements / leveling system
- [ ] Ratings from IMDB
- [ ] TVDB integration
- [ ] Personal configurable region, language, etc.
