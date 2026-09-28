import type { MovieOverview } from "../../../api/tmdb/models";
import { PosterCard } from "./PosterCard";

interface MovieCardProps {
    movie: MovieOverview;
}

export function MovieCard({ movie }: MovieCardProps) {
    return <PosterCard title={movie.title} posterPath={movie.poster_path} href={`/movie/${movie.id}`} label="MOVIE" labelClassName="bg-blue-600/80" year={movie.release_date} />;
}
