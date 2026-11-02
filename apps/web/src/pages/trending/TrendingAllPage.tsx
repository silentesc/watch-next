import { useNavigate, useParams } from "@tanstack/react-router";
import { Dropdown } from "../../components/ui/Dropdown";
import { Error } from "../../components/ui/Error";
import { MultiGrid } from "../../components/ui/lists/MultiGrid";
import { useTrendingAll } from "../../hooks/tmdb/use_trending_all";

export function TrendingAllPage() {
    const navigate = useNavigate({ from: "/trending/all/$timeWindow" });
    const timeWindowValues = new Map([
        ["day", "Day"],
        ["week", "Week"],
    ]);
    const { timeWindow } = useParams({ from: "/trending/all/$timeWindow" });

    if (!timeWindow) {
        return <Error message="Unspecified time window" />;
    }
    if (timeWindow !== "day" && timeWindow !== "week") {
        return <Error message="Time window must be 'day' or 'week'" />;
    }

    const trendingAllInfiniteQuery = useTrendingAll(timeWindow);

    const onTimeWindowSelect = (key: string) => {
        if (key === "day" || key === "week") {
            navigate({ to: "/trending/all/$timeWindow", params: { timeWindow: key } });
        }
    };

    return (
        <>
            <div className="flex justify-end mb-5">
                <Dropdown
                    title={timeWindowValues.get(timeWindow) || "Day"}
                    values={timeWindowValues}
                    onSelect={onTimeWindowSelect}
                    alignedRight
                />
            </div>
            <MultiGrid infiniteQuery={trendingAllInfiniteQuery} />
        </>
    );
}
