import { useNavigate, useParams } from "@tanstack/react-router";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { Person } from "../../components/ui/Person";
import { useTvSeriesDetails } from "../../hooks/tmdb/use_tv_series_details";
import { useTvSeriesAggregateCredits } from "../../hooks/tmdb/use_tv_series_aggregatecredits";
import { getJobsString } from "./ui/AggregateCrew";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function AggregateCrewPage() {
    const navigate = useNavigate();

    const { id } = useParams({ from: "/tv/$id/aggregate_crew" });

    const tvSeriesId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;

    if (!tvSeriesId) {
        return <Error message="Unknown tv series" />
    }

    const tvSeriesDetailsQuery = useTvSeriesDetails(tvSeriesId);
    const aggregateCreditsQuery = useTvSeriesAggregateCredits(tvSeriesId);

    if (tvSeriesDetailsQuery.error) {
        return <Error message={tvSeriesDetailsQuery.error.message} />
    }
    if (tvSeriesDetailsQuery.isLoading) {
        return <Loading />
    }
    if (!tvSeriesDetailsQuery.data) {
        return <Error message="No data returned" />
    }

    if (aggregateCreditsQuery.error) {
        return <Error message={aggregateCreditsQuery.error.message} />
    }
    if (aggregateCreditsQuery.isLoading) {
        return <Loading />
    }
    if (!aggregateCreditsQuery.data) {
        return <Error message="No data returned" />
    }

    const tvSeriesDetails = tvSeriesDetailsQuery.data;
    const crew = aggregateCreditsQuery.data.crew;

    const backToTvSeries = () => {
        navigate({ to: "/tv/$id", params: { id: String(tvSeriesDetails.id) } });
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Back button */}
            <div className="my-3 flex gap-1 items-center cursor-pointer" onClick={backToTvSeries}>
                <ArrowCircleRightIcon className="w-7 rotate-180" />
                <span className="text-lg text-nowrap">Back to {tvSeriesDetails.name}</span>
            </div>
            <h2 className="text-2xl font-bold">Crew</h2>
            <div className="flex flex-col gap-3 bg-background-secondary rounded-lg">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                    {crew.map((c) => c.id === undefined ? null : <Person key={`${c.name}-${getJobsString(c)}`} id={c.id} name={c.name || "Unknown"} imgPath={c.profile_path} description={getJobsString(c)} />)}
                </div>
            </div>
        </div>
    );
}
