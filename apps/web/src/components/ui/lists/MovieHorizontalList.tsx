import type { MovieOverview } from "../../../api/tmdb/models";
import { MovieCard } from "../cards/MovieCard";
import { SeeMoreHorizontalList } from "./SeeMoreHorizontalList";

interface MovieHorizontalListProps {
    movies: Array<MovieOverview>;
    seeMoreLinkHint: string;
    onSeeMoreClick: () => void;
}

export function MovieHorizontalList({ movies, seeMoreLinkHint, onSeeMoreClick }: MovieHorizontalListProps) {
    return <SeeMoreHorizontalList items={movies} getKey={movie => movie.id} renderItem={movie => <MovieCard movie={movie} />} seeMoreLinkHint={seeMoreLinkHint} onSeeMoreClick={onSeeMoreClick} />;
}
