import { type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { MovieOverview } from "../../../api/tmdb/models";
import { MovieCard } from "../cards/MovieCard";
import { InfiniteGrid, type InfinitePage } from "./InfiniteGrid";

interface MovieGridProps {
    infiniteQuery: UseInfiniteQueryResult<InfiniteData<InfinitePage<MovieOverview>, unknown>, globalThis.Error>;
}

export function MovieGrid({ infiniteQuery }: MovieGridProps) {
    return <InfiniteGrid infiniteQuery={infiniteQuery} getKey={movie => movie.id} renderItem={movie => <MovieCard movie={movie} />} />;
}
