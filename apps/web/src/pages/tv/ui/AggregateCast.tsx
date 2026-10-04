import { useNavigate } from "react-router";
import { Error } from "../../../components/ui/Error";
import { Loading } from "../../../components/ui/Loading";
import { type PersonProps } from "../../../components/ui/Person";
import { useTvSeriesAggregateCredits } from "../../../hooks/tmdb/use_tv_series_aggregatecredits";
import type { AggregateCast } from "../../../api/tmdb/models";
import { PersonHorizontalList } from "../../../components/ui/lists/PersonHorizontalList";
import { isScreenBig } from "../../../app/App";

interface AggregateCastProps {
    tvSeriesId: number;
}

export const getRolesString = (cast: AggregateCast) => {
    if (!cast.roles) {
        return "";
    }
    return cast.roles.map(r => r.character).filter(c => c).join(", ");
}

export function AggregateCast({ tvSeriesId }: AggregateCastProps) {
    const navigate = useNavigate();

    const tvSeriesAggregateCreditsQuery = useTvSeriesAggregateCredits(tvSeriesId);

    if (tvSeriesAggregateCreditsQuery.error) {
        return <Error message={tvSeriesAggregateCreditsQuery.error.message} />;
    }
    if (tvSeriesAggregateCreditsQuery.isLoading) {
        return <Loading />;
    }
    if (!tvSeriesAggregateCreditsQuery.data) {
        return <Error message="No data returned" />;
    }

    const cast = tvSeriesAggregateCreditsQuery.data.cast
        .filter(c => c.id !== undefined)
        .map(c => ({ id: c.id, name: c.name || "Unknown", description: getRolesString(c), imgPath: c.profile_path } as PersonProps));

    if (cast.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Cast</h2>
            <PersonHorizontalList people={cast} maxPeopleDisplayed={isScreenBig() ? 12 : 6} seeMoreLinkHint={`/tv/${tvSeriesId}/aggregate_cast`} onSeeMoreClick={() => navigate(`/tv/${tvSeriesId}/aggregate_cast`)} />
        </div>
    );
}
