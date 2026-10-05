import type { MovieOverview } from "../../../api/tmdb/models";
import { MovieCard } from "../cards/MovieCard";
import { SeeMoreHorizontalList, type SeeMoreLinkOptions } from "./SeeMoreHorizontalList";

interface MovieHorizontalListProps {
    movies: Array<MovieOverview>;
    seeMoreLinkOptions: SeeMoreLinkOptions;
}

export function MovieHorizontalList({ movies, seeMoreLinkOptions }: MovieHorizontalListProps) {
    return <SeeMoreHorizontalList items={movies} getKey={movie => movie.id} renderItem={movie => <MovieCard movie={movie} />} seeMoreLinkOptions={seeMoreLinkOptions} />;
}
