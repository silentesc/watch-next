import { useNavigate, useParams } from "react-router";
import { useMovieCredits } from "../../hooks/tmdb/use_credits";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { Person } from "../../components/ui/Person";
import { useMovieDetails } from "../../hooks/tmdb/use_movie_details";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function CastPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const movieId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;

    if (!movieId) {
        return <Error message="Unknown movie" />
    }

    const movieDetailsQuery = useMovieDetails(movieId);
    const creditsQuery = useMovieCredits(movieId);

    if (movieDetailsQuery.error) {
        return <Error message={movieDetailsQuery.error.message} />
    }
    if (movieDetailsQuery.isLoading) {
        return <Loading />
    }
    if (!movieDetailsQuery.data) {
        return <Error message="No data returned" />
    }

    if (creditsQuery.error) {
        return <Error message={creditsQuery.error.message} />
    }
    if (creditsQuery.isLoading) {
        return <Loading />
    }
    if (!creditsQuery.data) {
        return <Error message="No data returned" />
    }

    const movieDetails = movieDetailsQuery.data;
    const cast = creditsQuery.data.cast;

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
            <h2 className="text-2xl font-bold">Cast</h2>
            <div className="flex flex-col gap-3 bg-background-secondary rounded-lg">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                    {cast.map((c) => <Person key={`${c.name}-${c.character || ""}`} name={c.name || "Unknown"} imgPath={c.profile_path} description={c.character} />)}
                </div>
            </div>
        </div>
    );
}
