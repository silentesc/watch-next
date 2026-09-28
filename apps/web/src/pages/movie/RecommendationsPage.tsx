import { useNavigate, useParams } from "react-router";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { useMovieDetails } from "../../hooks/tmdb/use_movie_details";
import { MovieGrid } from "../../components/ui/lists/MovieGrid";
import { useMovieRecommendations } from "../../hooks/tmdb/use_movie_recommendations";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function RecommendationsPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const movieId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;

    if (!movieId) {
        return <Error message="Unknown movie" />
    }

    const movieDetailsQuery = useMovieDetails(movieId);
    const movieRecommendationsInfiniteQuery = useMovieRecommendations(movieId);

    if (movieDetailsQuery.error) {
        return <Error message={movieDetailsQuery.error.message} />
    }
    if (movieDetailsQuery.isLoading) {
        return <Loading />
    }
    if (!movieDetailsQuery.data) {
        return <Error message="No data returned" />
    }

    const movieDetails = movieDetailsQuery.data;

    const backToMovie = () => {
        navigate(`/movie/${movieDetails.id}`);
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Back button */}
            <div className="my-3 flex gap-1 items-center cursor-pointer" onClick={backToMovie}>
                <ArrowCircleRightIcon className="w-7 rotate-180" />
                <span className="text-lg text-nowrap">Back to {movieDetails.title}</span>
            </div>
            <h2 className="text-2xl font-bold">Recommendations</h2>
            <MovieGrid infiniteQuery={movieRecommendationsInfiniteQuery} />
        </div>
    );
}
