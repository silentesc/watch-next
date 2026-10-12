import type { TvSeriesOverview } from "../../../api/tmdb/models";
import type { ReactNode } from "react";
import { PosterCard } from "./PosterCard";

interface TvSeriesCardProps {
    tvSeries: TvSeriesOverview;
    children?: ReactNode;
}

export function TvSeriesCard({ tvSeries, children }: TvSeriesCardProps) {
    return <PosterCard title={tvSeries.name} description={tvSeries.first_air_date?.split("-")[0]} posterPath={tvSeries.poster_path} link={{ to: "/tv/$id", params: { id: String(tvSeries.id) } }} label="SERIES" labelClassName="bg-purple-600/80">{children}</PosterCard>;
}
