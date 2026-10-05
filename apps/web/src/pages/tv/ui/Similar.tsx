import { Loading } from "../../../components/ui/Loading";
import { Error } from "../../../components/ui/Error";
import type { TvSeriesOverview } from "../../../api/tmdb/models";
import { TvSeriesHorizontalList } from "../../../components/ui/lists/TvSeriesHorizontalList";
import { useSimilarTvSeries } from "../../../hooks/tmdb/use_similar_tv_series";

interface SimilarProps {
    tvSeriesId: number;
}

export function Similar({ tvSeriesId }: SimilarProps) {
    const similarTvSeriesQuery = useSimilarTvSeries(tvSeriesId);

    if (similarTvSeriesQuery.error) {
        return <Error message={similarTvSeriesQuery.error.message} />;
    }
    if (similarTvSeriesQuery.isLoading) {
        return <Loading />;
    }
    if (!similarTvSeriesQuery.data) {
        return <Error message="No data returned" />;
    }

    const allTvSeries: Array<TvSeriesOverview> = similarTvSeriesQuery.data.pages[0].results;

    if (allTvSeries.length === 0) {
        return null;
    }

    return (
        <div className="my-5 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Similar</h2>
            <TvSeriesHorizontalList tvSeries={allTvSeries} seeMoreLinkOptions={{ to: "/tv/$id/similar", params: { id: String(tvSeriesId) } }} />
        </div>
    );
}
