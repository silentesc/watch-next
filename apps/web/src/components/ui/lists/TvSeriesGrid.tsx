import { type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { TvSeriesCard } from "../cards/TvSeriesCard";
import { InfiniteGrid, type InfinitePage } from "./InfiniteGrid";

interface TvSeriesGridProps {
    infiniteQuery: UseInfiniteQueryResult<InfiniteData<InfinitePage<TvSeriesOverview>, unknown>, globalThis.Error>;
}

export function TvSeriesGrid({ infiniteQuery }: TvSeriesGridProps) {
    return <InfiniteGrid infiniteQuery={infiniteQuery} getKey={series => series.id ?? series.name ?? "unknown"} renderItem={series => <TvSeriesCard tvSeries={series} />} />;
}
