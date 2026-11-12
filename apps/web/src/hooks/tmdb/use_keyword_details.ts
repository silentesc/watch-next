import { useQueries, useQuery } from "@tanstack/react-query";
import { getKeywordDetails } from "../../api/tmdb/keyword/details";

function keywordDetailsQuery(keywordId: number | null) {
    return {
        queryKey: ["keywordDetailsQuery", keywordId],
        queryFn: () => getKeywordDetails(keywordId!),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: keywordId !== null,
    };
}

export function useKeywordDetails(keywordId: number | null) {
    return useQuery(keywordDetailsQuery(keywordId));
}

export function useKeywordDetailsList(keywordIds: number[]) {
    return useQueries({
        queries: keywordIds.map(keywordId => keywordDetailsQuery(keywordId)),
    });
}
