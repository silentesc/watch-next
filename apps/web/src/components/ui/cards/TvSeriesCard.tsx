import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { PosterCard } from "./PosterCard";

interface TvSeriesCardProps {
    tvSeries: TvSeriesOverview;
}

export function TvSeriesCard({ tvSeries }: TvSeriesCardProps) {
    return <PosterCard title={tvSeries.name} posterPath={tvSeries.poster_path} href={`/tv/${tvSeries.id}`} label="SERIES" labelClassName="bg-purple-600/80" year={tvSeries.first_air_date} />;
}
