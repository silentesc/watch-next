import { useNavigate, useParams } from "@tanstack/react-router";
import { Dropdown } from "../../components/ui/Dropdown";
import { Error } from "../../components/ui/Error";
import { useTrendingTvSeries } from "../../hooks/tmdb/use_trending_tv_series";
import { TvSeriesGrid } from "../../components/ui/lists/TvSeriesGrid";

export function TrendingTvSeriesPage() {
    const navigate = useNavigate({ from: "/discover/trending/tv/$timeWindow" });

    const timeWindowValues = new Map([
        ["day", "Day"],
        ["week", "Week"],
    ]);

    const { timeWindow } = useParams({ from: "/discover/trending/tv/$timeWindow" });

    if (!timeWindow) {
        return <Error message="Unspecified time window" />
    }
    if (timeWindow !== "day" && timeWindow !== "week") {
        return <Error message="Time window must be 'day' or 'week'" />
    }

    const trendingTvSeriesInfiniteQuery = useTrendingTvSeries((timeWindow));

    const onTimeWindowSelect = (key: string) => {
        if (key === "day" || key === "week") {
            navigate({ to: "/discover/trending/tv/$timeWindow", params: { timeWindow: key } });
        }
    }

    return (
        <>
            {/* Bar */}
            <div className="flex justify-end mb-5">
                <div className="flex gap-2">
                    <Dropdown
                        title={timeWindowValues.get(timeWindow) || "day"}
                        values={timeWindowValues}
                        onSelect={onTimeWindowSelect}
                        alignedRight
                    />
                </div>
            </div>

            {/* TV Series */}
            <TvSeriesGrid infiniteQuery={trendingTvSeriesInfiniteQuery} />
        </>
    );
}
