import { useNavigate } from "react-router";
import { Error } from "../../../components/ui/Error";
import { Loading } from "../../../components/ui/Loading";
import { Person } from "../../../components/ui/Person";
import { useMovieCredits } from "../../../hooks/tmdb/use_credits";
import { ArrowCircleRightIcon } from "../../../components/ui/icons/Icons";

interface CastProps {
    movieId: number;
}

export function Cast({ movieId }: CastProps) {
    const navigate = useNavigate();

    const movieCreditsQuery = useMovieCredits(movieId);

    if (movieCreditsQuery.error) {
        return <Error message={movieCreditsQuery.error.message} />;
    }
    if (movieCreditsQuery.isLoading) {
        return <Loading />;
    }
    if (!movieCreditsQuery.data) {
        return <Error message="No data returned" />;
    }

    const seeMore = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/movie/${movieId}/cast`);
    }

    const cast = movieCreditsQuery.data.cast;
    const topCast = cast.slice(0, 5);
    const hintCast = cast.length >= 5 ? cast[5] : undefined;

    if (cast.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Cast</h2>
            <div className="flex flex-col gap-3 bg-background-secondary rounded-lg">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                    {topCast.map((c) => (
                        <Person key={`${c.name}-${c.character || ""}`} name={c.name || "Unknown"} imgPath={c.profile_path} description={c.character} />
                    ))}
                    {hintCast ? (
                        <div className="relative">
                            <div className="blur-sm select-none pointer-events-none">
                                <Person key={`${hintCast.name}-${hintCast.character || ""}`} name={hintCast.name || "Unknown"} imgPath={hintCast.profile_path} description={hintCast.character} />
                            </div>
                            <a href={`/movie/${movieId}/cast`} onClick={seeMore}>
                                <div className="absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer flex gap-1 items-center">
                                    <span className="font-semibold">See more</span>
                                    <ArrowCircleRightIcon className="w-7" />
                                </div>
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
