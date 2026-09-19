###############
# Web builder #
###############
FROM node:alpine3.24 AS web-builder

WORKDIR /app/web

COPY apps/web/package*.json ./
RUN npm ci

COPY apps/web/ ./
RUN npm run build


##################
# Server builder #
##################
FROM rust:1.98-alpine3.24 AS server-builder

RUN apk add --no-cache \
    build-base \
    musl-dev \
    pkgconfig \
    openssl-dev \
    sqlite-dev

WORKDIR /app/server

COPY apps/server/ ./

RUN cargo build --release --locked


##########
# Runner #
##########
FROM alpine:3.24

RUN apk add --no-cache \
    ca-certificates \
    sqlite-libs \
    tzdata

ENV TZ=Etc/UTC \
    SERVE_ADDR=0.0.0.0:5657 \
    TMDB_BASE_URL=https://api.themoviedb.org/3 \
    TMDB_CACHE_TTL_MINUTES=60

WORKDIR /app

COPY --from=server-builder \
    /app/server/target/release/watch-next-server \
    /app/watch-next-server

COPY --from=web-builder \
    /app/web/dist \
    /app/web

EXPOSE 5657

ENTRYPOINT ["/app/watch-next-server"]
