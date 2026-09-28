import { useNavigate, useParams } from "react-router";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { useTvSeriesDetails } from "../../hooks/tmdb/use_tv_series_details";
import { useSimilarTvSeries } from "../../hooks/tmdb/use_similar_tv_series";
import { TvSeriesGrid } from "../../components/ui/lists/TvSeriesGrid";
import { ArrowCircleRightIcon } from "../../components/ui/icons/Icons";

export function TvSeriesSimilarPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const tvSeriesId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;

    if (!tvSeriesId) {
        return <Error message="Unknown tv series" />
    }

    const tvSeriesDetailsQuery = useTvSeriesDetails(tvSeriesId);
    const similarTvSeriesInfiniteQuery = useSimilarTvSeries(tvSeriesId);

    if (tvSeriesDetailsQuery.error) {
        return <Error message={tvSeriesDetailsQuery.error.message} />
    }
    if (tvSeriesDetailsQuery.isLoading) {
        return <Loading />
    }
    if (!tvSeriesDetailsQuery.data) {
        return <Error message="No data returned" />
    }

    const tvSeriesDetails = tvSeriesDetailsQuery.data;

    const backToTvSeries = () => {
        navigate(`/tv/${tvSeriesDetails.id}`);
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Back button */}
            <div className="my-3 flex gap-1 items-center cursor-pointer" onClick={backToTvSeries}>
                <ArrowCircleRightIcon className="w-7 rotate-180" />
                <span className="text-lg text-nowrap">Back to {tvSeriesDetails.name}</span>
            </div>
            <h2 className="text-2xl font-bold">Similar</h2>
            <TvSeriesGrid infiniteQuery={similarTvSeriesInfiniteQuery} />
        </div>
    );
}
