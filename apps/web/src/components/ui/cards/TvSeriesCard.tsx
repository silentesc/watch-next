import type { TvSeriesOverview } from "../../../api/tmdb/models";
import type { ReactNode } from "react";
import { PosterCard } from "./PosterCard";

interface TvSeriesCardProps {
    tvSeries: TvSeriesOverview;
    children?: ReactNode;
    navigable?: boolean;
}

export function TvSeriesCard({ tvSeries, children, navigable = true }: TvSeriesCardProps) {
    return <PosterCard title={tvSeries.name} description={tvSeries.first_air_date?.split("-")[0]} posterPath={tvSeries.poster_path} link={navigable ? { to: "/tv/$id", params: { id: String(tvSeries.id) } } : undefined} label="SERIES" labelClassName="bg-purple-600/80">{children}</PosterCard>;
}
