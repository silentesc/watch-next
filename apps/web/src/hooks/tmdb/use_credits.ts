import { useQuery } from "@tanstack/react-query";
import { getMovieCredits } from "../../api/tmdb/movie/credits";

export function useMovieCredits(movieId: number) {
    return useQuery({
        queryKey: ["movieCreditsQuery", movieId],
        queryFn: () => getMovieCredits(movieId),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: !!movieId
    });
}
