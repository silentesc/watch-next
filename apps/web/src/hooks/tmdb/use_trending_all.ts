import { useInfiniteQuery } from "@tanstack/react-query";
import { getTrendingAll } from "../../api/tmdb/trending/all";

export function useTrendingAll(timeWindow: "day" | "week", language?: string) {
    return useInfiniteQuery({
        queryKey: ["trendingAllInfiniteQuery", timeWindow, language],
        queryFn: ({ pageParam }) => getTrendingAll(timeWindow, pageParam, language),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}
