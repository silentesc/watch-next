import { describe, expect, it } from "vitest";
import {
    getMovieFiltersFromParams,
    getTvSeriesFiltersFromParams,
    getMovieSearchFromFilters,
    getTvSeriesSearchFromFilters,
} from "./utils";

describe("discover filter query parameters", () => {
    it("round trips movie filters", () => {
        const filters = {
            releaseDateFrom: new Date(2024, 0, 2),
            releaseDateTo: new Date(2024, 1, 3),
            runtimeFrom: 90,
            runtimeTo: 180,
            tmdbRatingFrom: 7,
            tmdbRatingTo: 9,
            tmdbVoteCountFrom: 100,
            tmdbVoteCountTo: 1000,
            withGenres: "28,35",
            withoutGenres: "27",
            originalLanguage: "en",
        };
        const queryParams = getMovieSearchFromFilters(filters, "vote_average.desc");

        expect(getMovieFiltersFromParams(queryParams)).toEqual(filters);
    });

    it("uses first-air-date parameter names for TV filters", () => {
        const filters = {
            firstAirDateFrom: new Date(2024, 0, 2),
            firstAirDateTo: new Date(2024, 1, 3),
            runtimeFrom: undefined,
            runtimeTo: undefined,
            tmdbRatingFrom: undefined,
            tmdbRatingTo: undefined,
            tmdbVoteCountFrom: undefined,
            tmdbVoteCountTo: undefined,
            withStatus: "0",
            withGenres: "18",
            withoutGenres: undefined,
            originalLanguage: undefined,
        };
        const queryParams = getTvSeriesSearchFromFilters(filters, "popularity.desc");

        expect(getTvSeriesFiltersFromParams(queryParams)).toEqual(filters);
    });

    it("preserves zero-valued numeric filters", () => {
        const filters = {
            releaseDateFrom: undefined,
            releaseDateTo: undefined,
            runtimeFrom: 0,
            runtimeTo: undefined,
            tmdbRatingFrom: 0,
            tmdbRatingTo: undefined,
            tmdbVoteCountFrom: 0,
            tmdbVoteCountTo: undefined,
            withGenres: undefined,
            withoutGenres: undefined,
            originalLanguage: undefined,
        };
        const queryParams = getMovieSearchFromFilters(filters, "popularity.desc");

        expect(queryParams.runtimeFrom).toBe("0");
        expect(queryParams.tmdbRatingFrom).toBe("0");
        expect(queryParams.tmdbVoteCountFrom).toBe("0");
    });
});
