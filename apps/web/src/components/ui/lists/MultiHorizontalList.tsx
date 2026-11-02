import type { MultiSearchResult } from "../../../api/tmdb/models";
import { CollectionCard } from "../cards/CollectionCard";
import { MovieCard } from "../cards/MovieCard";
import { PersonCard } from "../cards/PersonCard";
import { TvSeriesCard } from "../cards/TvSeriesCard";
import { SeeMoreHorizontalList, type SeeMoreLinkOptions } from "./SeeMoreHorizontalList";

interface MultiHorizontalListProps {
    results: Array<MultiSearchResult>;
    seeMoreLinkOptions: SeeMoreLinkOptions;
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
        case "collection":
            return <CollectionCard collection={multi_search_result} />
        case "person":
            return multi_search_result.id === undefined ? null : <PersonCard id={multi_search_result.id} name={multi_search_result.name || "Unknown"} posterPath={multi_search_result.profile_path} />
    }
};

export function MultiHorizontalList({ results, seeMoreLinkOptions }: MultiHorizontalListProps) {
    return <SeeMoreHorizontalList items={results} getKey={getKey} renderItem={renderItem} seeMoreLinkOptions={seeMoreLinkOptions} />;
}
