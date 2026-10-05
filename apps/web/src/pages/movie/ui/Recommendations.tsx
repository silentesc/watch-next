import { Loading } from "../../../components/ui/Loading";
import { Error } from "../../../components/ui/Error";
import type { MovieOverview } from "../../../api/tmdb/models";
import { useMovieRecommendations } from "../../../hooks/tmdb/use_movie_recommendations";
import { MovieHorizontalList } from "../../../components/ui/lists/MovieHorizontalList";

interface RecommendationsProps {
    movieId: number;
}

export function Recommendations({ movieId }: RecommendationsProps) {
    const movieRecommendationsQuery = useMovieRecommendations(movieId);

    if (movieRecommendationsQuery.error) {
        return <Error message={movieRecommendationsQuery.error.message} />;
    }
    if (movieRecommendationsQuery.isLoading) {
        return <Loading />;
    }
    if (!movieRecommendationsQuery.data) {
        return <Error message="No data returned" />;
    }

    const allMovies: Array<MovieOverview> = movieRecommendationsQuery.data.pages[0].results;

    if (allMovies.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Recommendations</h2>
            <MovieHorizontalList movies={allMovies} seeMoreLinkOptions={{ to: "/movie/$id/recommendations", params: { id: String(movieId) } }} />
        </div>
    );
}
