import { useNavigate, useParams } from "@tanstack/react-router";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { useMovieDetails } from "../../hooks/tmdb/use_movie_details";
import { MovieGrid } from "../../components/ui/lists/MovieGrid";
import { useSimilarMovies } from "../../hooks/tmdb/use_similar_movies";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function SimilarPage() {
    const navigate = useNavigate();

    const { id } = useParams({ from: "/movie/$id/similar" });

    const movieId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;

    if (!movieId) {
        return <Error message="Unknown movie" />
    }

    const movieDetailsQuery = useMovieDetails(movieId);
    const similarMoviesInfiniteQuery = useSimilarMovies(movieId);

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
        navigate({ to: "/movie/$id", params: { id: String(movieDetails.id) } });
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Back button */}
            <div className="my-3 flex gap-1 items-center cursor-pointer" onClick={backToMovie}>
                <ArrowCircleRightIcon className="w-7 rotate-180" />
                <span className="text-lg text-nowrap">Back to {movieDetails.title}</span>
            </div>
            <h2 className="text-2xl font-bold">Similar</h2>
            <MovieGrid infiniteQuery={similarMoviesInfiniteQuery} />
        </div>
    );
}
