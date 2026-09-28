import { useNavigate } from "react-router";
import { Error } from "../../../components/ui/Error";
import { Loading } from "../../../components/ui/Loading";
import { Person } from "../../../components/ui/Person";
import { useTvSeriesAggregateCredits } from "../../../hooks/tmdb/use_tv_series_aggregatecredits";
import type { AggregateCrew } from "../../../api/tmdb/models";
import { ArrowCircleRightIcon } from "../../../components/ui/icons/Icons";

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

    const seeMore = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`/tv/${tvSeriesId}/aggregate_crew`);
    }

    const crew = tvSeriesAggregateCreditsQuery.data.crew;
    const topCrew = crew.slice(0, 9);
    const hintCrew = crew.length >= 9 ? crew[9] : undefined;

    if (crew.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Crew</h2>
            <div className="flex flex-col gap-3 bg-background-secondary rounded-lg">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                    {topCrew.map((c) => (
                        <Person key={`${c.name}-${getJobsString(c)}`} name={c.name || "Unknown"} imgPath={c.profile_path} description={getJobsString(c)} />
                    ))}
                    {hintCrew ? (
                        <div className="relative">
                            <div className="blur-sm select-none pointer-events-none">
                                <Person key={`${hintCrew.name}-${getJobsString(hintCrew)}`} name={hintCrew.name || "Unknown"} imgPath={hintCrew.profile_path} description={getJobsString(hintCrew)} />
                            </div>
                            <a href={`/tv/${tvSeriesId}/aggregate_crew`} onClick={seeMore}>
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
