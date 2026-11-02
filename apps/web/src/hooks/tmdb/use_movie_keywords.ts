import { useQuery } from "@tanstack/react-query";
import { getMovieKeywords } from "../../api/tmdb/movie/keywords";

export function useMovieKeywords(movieId: number | null) {
    return useQuery({
        queryKey: ["movieKeywordsQuery", movieId],
        queryFn: () => getMovieKeywords(movieId!),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: movieId !== null,
    });
}
