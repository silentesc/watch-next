import type { MovieFilters } from "./ui/MovieFilters";
import type { TvSeriesFilters } from "./ui/TvSeriesFilters";
import { formatDate, parseIsoDate } from "../../components/ui/DatePicker";
import type { DiscoverMovieSearch, DiscoverTvSearch } from "../../app/search";

export function getMovieFiltersFromParams(queryParams: DiscoverMovieSearch) {
    return {
        releaseDateFrom: queryParams.releaseDateFrom ? parseIsoDate(queryParams.releaseDateFrom) : undefined,
        releaseDateTo: queryParams.releaseDateTo ? parseIsoDate(queryParams.releaseDateTo) : undefined,
        runtimeFrom: queryParams.runtimeFrom ? Number(queryParams.runtimeFrom) : undefined,
        runtimeTo: queryParams.runtimeTo ? Number(queryParams.runtimeTo) : undefined,
        tmdbRatingFrom: queryParams.tmdbRatingFrom ? Number(queryParams.tmdbRatingFrom) : undefined,
        tmdbRatingTo: queryParams.tmdbRatingTo ? Number(queryParams.tmdbRatingTo) : undefined,
        tmdbVoteCountFrom: queryParams.tmdbVoteCountFrom ? Number(queryParams.tmdbVoteCountFrom) : undefined,
        tmdbVoteCountTo: queryParams.tmdbVoteCountTo ? Number(queryParams.tmdbVoteCountTo) : undefined,
        withGenres: queryParams.withGenres || undefined,
        withoutGenres: queryParams.withoutGenres || undefined,
        originalLanguage: queryParams.originalLanguage || undefined,
    } as MovieFilters;
}

export function getTvSeriesFiltersFromParams(queryParams: DiscoverTvSearch) {
    return {
        firstAirDateFrom: queryParams.firstAirDateFrom ? parseIsoDate(queryParams.firstAirDateFrom) : undefined,
        firstAirDateTo: queryParams.firstAirDateTo ? parseIsoDate(queryParams.firstAirDateTo) : undefined,
        runtimeFrom: queryParams.runtimeFrom ? Number(queryParams.runtimeFrom) : undefined,
        runtimeTo: queryParams.runtimeTo ? Number(queryParams.runtimeTo) : undefined,
        tmdbRatingFrom: queryParams.tmdbRatingFrom ? Number(queryParams.tmdbRatingFrom) : undefined,
        tmdbRatingTo: queryParams.tmdbRatingTo ? Number(queryParams.tmdbRatingTo) : undefined,
        tmdbVoteCountFrom: queryParams.tmdbVoteCountFrom ? Number(queryParams.tmdbVoteCountFrom) : undefined,
        tmdbVoteCountTo: queryParams.tmdbVoteCountTo ? Number(queryParams.tmdbVoteCountTo) : undefined,
        withStatus: queryParams.withStatus || undefined,
        withGenres: queryParams.withGenres || undefined,
        withoutGenres: queryParams.withoutGenres || undefined,
        originalLanguage: queryParams.originalLanguage || undefined,
    } as TvSeriesFilters;
}

export function getMovieSearchFromFilters(filters: MovieFilters, sortBy: string): DiscoverMovieSearch {
    return {
        sortBy,
        releaseDateFrom: filters.releaseDateFrom ? formatDate(filters.releaseDateFrom.getFullYear(), filters.releaseDateFrom.getMonth(), filters.releaseDateFrom.getDate()) : undefined,
        releaseDateTo: filters.releaseDateTo ? formatDate(filters.releaseDateTo.getFullYear(), filters.releaseDateTo.getMonth(), filters.releaseDateTo.getDate()) : undefined,
        runtimeFrom: filters.runtimeFrom?.toString(),
        runtimeTo: filters.runtimeTo?.toString(),
        tmdbRatingFrom: filters.tmdbRatingFrom?.toString(),
        tmdbRatingTo: filters.tmdbRatingTo?.toString(),
        tmdbVoteCountFrom: filters.tmdbVoteCountFrom?.toString(),
        tmdbVoteCountTo: filters.tmdbVoteCountTo?.toString(),
        withGenres: filters.withGenres,
        withoutGenres: filters.withoutGenres,
        originalLanguage: filters.originalLanguage,
    };
}

export function getTvSeriesSearchFromFilters(filters: TvSeriesFilters, sortBy: string): DiscoverTvSearch {
    return {
        sortBy,
        firstAirDateFrom: filters.firstAirDateFrom ? formatDate(filters.firstAirDateFrom.getFullYear(), filters.firstAirDateFrom.getMonth(), filters.firstAirDateFrom.getDate()) : undefined,
        firstAirDateTo: filters.firstAirDateTo ? formatDate(filters.firstAirDateTo.getFullYear(), filters.firstAirDateTo.getMonth(), filters.firstAirDateTo.getDate()) : undefined,
        runtimeFrom: filters.runtimeFrom?.toString(),
        runtimeTo: filters.runtimeTo?.toString(),
        tmdbRatingFrom: filters.tmdbRatingFrom?.toString(),
        tmdbRatingTo: filters.tmdbRatingTo?.toString(),
        tmdbVoteCountFrom: filters.tmdbVoteCountFrom?.toString(),
        tmdbVoteCountTo: filters.tmdbVoteCountTo?.toString(),
        withStatus: filters.withStatus,
        withGenres: filters.withGenres,
        withoutGenres: filters.withoutGenres,
        originalLanguage: filters.originalLanguage,
    };
}
