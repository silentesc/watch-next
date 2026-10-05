export interface DiscoverMovieSearch {
    sortBy?: string;
    releaseDateFrom?: string;
    releaseDateTo?: string;
    runtimeFrom?: string;
    runtimeTo?: string;
    tmdbRatingFrom?: string;
    tmdbRatingTo?: string;
    tmdbVoteCountFrom?: string;
    tmdbVoteCountTo?: string;
    withGenres?: string;
    withoutGenres?: string;
    originalLanguage?: string;
}

export interface DiscoverTvSearch {
    sortBy?: string;
    firstAirDateFrom?: string;
    firstAirDateTo?: string;
    runtimeFrom?: string;
    runtimeTo?: string;
    tmdbRatingFrom?: string;
    tmdbRatingTo?: string;
    tmdbVoteCountFrom?: string;
    tmdbVoteCountTo?: string;
    withStatus?: string;
    withGenres?: string;
    withoutGenres?: string;
    originalLanguage?: string;
}

export interface SearchPageSearch {
    category?: string;
    query?: string;
}

export interface PersonPageSearch {
    filter?: string;
    sortBy?: string;
}

export function validateStringSearch<T extends object>(search: Record<string, unknown>): T {
    return Object.fromEntries(Object.entries(search).filter(([, value]) => typeof value === "string")) as T;
}