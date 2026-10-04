import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { TvSeriesCard } from "../cards/TvSeriesCard";
import { SeeMoreHorizontalList } from "./SeeMoreHorizontalList";

interface TvSeriesHorizontalListProps {
    tvSeries: Array<TvSeriesOverview>;
    seeMoreLinkHint: string;
    onSeeMoreClick: () => void;
}

export function TvSeriesHorizontalList({ tvSeries, seeMoreLinkHint, onSeeMoreClick }: TvSeriesHorizontalListProps) {
    return <SeeMoreHorizontalList items={tvSeries} getKey={series => series.id ?? series.name ?? "unknown"} renderItem={series => <TvSeriesCard tvSeries={series} />} seeMoreLinkHint={seeMoreLinkHint} onSeeMoreClick={onSeeMoreClick} />;
}
