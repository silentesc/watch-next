import { Error } from "../../../components/ui/Error";
import { Loading } from "../../../components/ui/Loading";
import { type PersonProps } from "../../../components/ui/Person";
import { useMovieCredits } from "../../../hooks/tmdb/use_credits";
import { PersonHorizontalList } from "../../../components/ui/lists/PersonHorizontalList";
import { isScreenBig } from "../../../app/App";

interface CastProps {
    movieId: number;
}

export function Cast({ movieId }: CastProps) {
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

    const cast = movieCreditsQuery.data.cast.map(c => ({ id: c.id, name: c.name || "Unknown", description: c.character, imgPath: c.profile_path } as PersonProps));

    if (cast.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Cast</h2>
            <PersonHorizontalList people={cast} maxPeopleDisplayed={isScreenBig() ? 10 : 5} seeMoreLinkOptions={{ to: "/movie/$id/cast", params: { id: String(movieId) } }} />
        </div>
    );
}
