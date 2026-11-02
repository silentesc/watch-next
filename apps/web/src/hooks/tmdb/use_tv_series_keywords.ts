import { useQuery } from "@tanstack/react-query";
import { getTvSeriesKeywords } from "../../api/tmdb/tv_series/keywords";

export function useTvSeriesKeywords(seriesId: number | null) {
    return useQuery({
        queryKey: ["tvSeriesKeywordsQuery", seriesId],
        queryFn: () => getTvSeriesKeywords(seriesId!),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: seriesId !== null,
    });
}
