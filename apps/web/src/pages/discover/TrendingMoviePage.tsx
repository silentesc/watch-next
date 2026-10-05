import { MovieGrid } from "../../components/ui/lists/MovieGrid";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useTrendingMovies } from "../../hooks/tmdb/use_trending_movies";
import { Dropdown } from "../../components/ui/Dropdown";
import { Error } from "../../components/ui/Error";

export function TrendingMoviePage() {
    const navigate = useNavigate({ from: "/discover/trending/movie/$timeWindow" });

    const timeWindowValues = new Map([
        ["day", "Day"],
        ["week", "Week"],
    ]);

    const { timeWindow } = useParams({ from: "/discover/trending/movie/$timeWindow" });

    if (!timeWindow) {
        return <Error message="Unspecified time window" />
    }
    if (timeWindow !== "day" && timeWindow !== "week") {
        return <Error message="Time window must be 'day' or 'week'" />
    }

    const trendingMovieInfiniteQuery = useTrendingMovies((timeWindow));

    const onTimeWindowSelect = (key: string) => {
        if (key === "day" || key === "week") {
            navigate({ to: "/discover/trending/movie/$timeWindow", params: { timeWindow: key } });
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

            {/* Movies */}
            <MovieGrid infiniteQuery={trendingMovieInfiniteQuery} />
        </>
    );
}
