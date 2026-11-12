import { useQuery } from "@tanstack/react-query";
import { getKeywordDetails } from "../../api/tmdb/keyword/details";

export function useKeywordDetails(keywordId: number | null) {
    return useQuery({
        queryKey: ["keywordDetailsQuery", keywordId],
        queryFn: () => getKeywordDetails(keywordId!),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: keywordId !== null,
    });
}
