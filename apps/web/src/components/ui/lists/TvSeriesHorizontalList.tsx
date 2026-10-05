import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { TvSeriesCard } from "../cards/TvSeriesCard";
import { SeeMoreHorizontalList, type SeeMoreLinkOptions } from "./SeeMoreHorizontalList";

interface TvSeriesHorizontalListProps {
    tvSeries: Array<TvSeriesOverview>;
    seeMoreLinkOptions: SeeMoreLinkOptions;
}

export function TvSeriesHorizontalList({ tvSeries, seeMoreLinkOptions }: TvSeriesHorizontalListProps) {
    return <SeeMoreHorizontalList items={tvSeries} getKey={series => series.id ?? series.name ?? "unknown"} renderItem={series => <TvSeriesCard tvSeries={series} />} seeMoreLinkOptions={seeMoreLinkOptions} />;
}
