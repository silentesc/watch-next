import { Loading } from "../../../components/ui/Loading";
import { Error } from "../../../components/ui/Error";
import type { MovieOverview } from "../../../api/tmdb/models";
import { useSimilarMovies } from "../../../hooks/tmdb/use_similar_movies";
import { MovieHorizontalList } from "../../../components/ui/lists/MovieHorizontalList";

interface SimilarProps {
    movieId: number;
}

export function Similar({ movieId }: SimilarProps) {
    const similarMoviesQuery = useSimilarMovies(movieId);

    if (similarMoviesQuery.error) {
        return <Error message={similarMoviesQuery.error.message} />;
    }
    if (similarMoviesQuery.isLoading) {
        return <Loading />;
    }
    if (!similarMoviesQuery.data) {
        return <Error message="No data returned" />;
    }

    const allMovies: Array<MovieOverview> = similarMoviesQuery.data.pages[0].results;

    if (allMovies.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Similar</h2>
            <MovieHorizontalList movies={allMovies} seeMoreLinkOptions={{ to: "/movie/$id/similar", params: { id: String(movieId) } }} />
        </div>
    );
}
