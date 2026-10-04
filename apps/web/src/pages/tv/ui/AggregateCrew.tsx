import { useNavigate } from "react-router";
import { Error } from "../../../components/ui/Error";
import { Loading } from "../../../components/ui/Loading";
import { type PersonProps } from "../../../components/ui/Person";
import { useTvSeriesAggregateCredits } from "../../../hooks/tmdb/use_tv_series_aggregatecredits";
import type { AggregateCrew } from "../../../api/tmdb/models";
import { PersonHorizontalList } from "../../../components/ui/lists/PersonHorizontalList";
import { isScreenBig } from "../../../app/App";

interface AggregateCrewProps {
    tvSeriesId: number;
}

export const getJobsString = (crew: AggregateCrew) => {
    if (!crew.jobs) {
        return "";
    }
    return crew.jobs.map(j => j.job).filter(j => j).join(", ")
}

export function AggregateCrew({ tvSeriesId }: AggregateCrewProps) {
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

    const crew = tvSeriesAggregateCreditsQuery.data.crew
        .filter(c => c.id !== undefined)
        .map(c => ({ id: c.id, name: c.name || "Unknown", description: getJobsString(c), imgPath: c.profile_path } as PersonProps));

    if (crew.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Crew</h2>
            <PersonHorizontalList people={crew} maxPeopleDisplayed={isScreenBig() ? 12 : 6} seeMoreLinkHint={`/tv/${tvSeriesId}/aggregate_crew`} onSeeMoreClick={() => navigate(`/tv/${tvSeriesId}/aggregate_crew`)} />
        </div>
    );
}
