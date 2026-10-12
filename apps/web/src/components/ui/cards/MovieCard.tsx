import type { MovieOverview } from "../../../api/tmdb/models";
import type { ReactNode } from "react";
import { PosterCard } from "./PosterCard";

interface MovieCardProps {
    movie: MovieOverview;
    children?: ReactNode;
}

export function MovieCard({ movie, children }: MovieCardProps) {
    return <PosterCard title={movie.title} description={movie.release_date?.split("-")[0]} posterPath={movie.poster_path} link={{ to: "/movie/$id", params: { id: String(movie.id) } }} label="MOVIE" labelClassName="bg-blue-600/80">{children}</PosterCard>;
}
