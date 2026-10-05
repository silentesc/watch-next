import { Loading } from "../../../components/ui/Loading";
import { Error } from "../../../components/ui/Error";
import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { useTvSeriesRecommendations } from "../../../hooks/tmdb/use_tv_series_recommendations";
import { TvSeriesHorizontalList } from "../../../components/ui/lists/TvSeriesHorizontalList";

interface RecommendationsProps {
    tvSeriesId: number;
}

export function Recommendations({ tvSeriesId }: RecommendationsProps) {
    const tvSeriesRecommendationsQuery = useTvSeriesRecommendations(tvSeriesId);

    if (tvSeriesRecommendationsQuery.error) {
        return <Error message={tvSeriesRecommendationsQuery.error.message} />;
    }
    if (tvSeriesRecommendationsQuery.isLoading) {
        return <Loading />;
    }
    if (!tvSeriesRecommendationsQuery.data) {
        return <Error message="No data returned" />;
    }

    const allTvSeries: Array<TvSeriesOverview> = tvSeriesRecommendationsQuery.data.pages[0].results;

    if (allTvSeries.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Recommendations</h2>
            <TvSeriesHorizontalList tvSeries={allTvSeries} seeMoreLinkOptions={{ to: "/tv/$id/recommendations", params: { id: String(tvSeriesId) } }} />
        </div>
    );
}
