import { type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { MultiSearchResult } from "../../../api/tmdb/models";
import { MovieCard } from "../cards/MovieCard";
import { InfiniteGrid, type InfinitePage } from "./InfiniteGrid";
import { TvSeriesCard } from "../cards/TvSeriesCard";
import { PersonCard } from "../cards/PersonCard";

interface MultiGridProps {
    infiniteQuery: UseInfiniteQueryResult<InfiniteData<InfinitePage<MultiSearchResult>, unknown>, globalThis.Error>;
}

const getKey = (multi_search_result: MultiSearchResult) => {
    return `${multi_search_result.media_type}_${multi_search_result.id}`
};

const renderItem = (multi_search_result: MultiSearchResult) => {
    switch (multi_search_result.media_type) {
        case "movie":
            return <MovieCard movie={multi_search_result} />
        case "tv":
            return <TvSeriesCard tvSeries={multi_search_result} />
        case "person":
            return <PersonCard person={multi_search_result} />
    }
};

export function MultiGrid({ infiniteQuery }: MultiGridProps) {
    return <InfiniteGrid infiniteQuery={infiniteQuery} getKey={getKey} renderItem={renderItem} />;
}
