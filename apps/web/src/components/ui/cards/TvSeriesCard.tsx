import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { PosterCard } from "./PosterCard";

interface TvSeriesCardProps {
    tvSeries: TvSeriesOverview;
}

export function TvSeriesCard({ tvSeries }: TvSeriesCardProps) {
    return <PosterCard title={tvSeries.name} description={tvSeries.first_air_date?.split("-")[0]} posterPath={tvSeries.poster_path} href={`/tv/${tvSeries.id}`} label="SERIES" labelClassName="bg-purple-600/80" />;
}
