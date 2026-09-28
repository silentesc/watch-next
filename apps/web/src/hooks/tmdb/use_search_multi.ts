import { useInfiniteQuery } from "@tanstack/react-query";
import { search_multi } from "../../api/tmdb/search/multi";

export function useSearchMulti(category: string, text: string) {
    return useInfiniteQuery({
        queryKey: ["search", category, text],
        queryFn: ({ pageParam }) => search_multi(text, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!text && category === "multi",
        retry: false,
    });
}
