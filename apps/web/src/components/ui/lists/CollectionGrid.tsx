import { type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import type { CollectionOverview } from "../../../api/tmdb/models";
import { CollectionCard } from "../cards/CollectionCard";
import { InfiniteGrid, type InfinitePage } from "./InfiniteGrid";

interface CollectionGridProps {
    infiniteQuery: UseInfiniteQueryResult<InfiniteData<InfinitePage<CollectionOverview>, unknown>, globalThis.Error>;
}

export function CollectionGrid({ infiniteQuery }: CollectionGridProps) {
    return <InfiniteGrid infiniteQuery={infiniteQuery} getKey={collection => collection.id} renderItem={collection => <CollectionCard collection={collection} />} />;
}
