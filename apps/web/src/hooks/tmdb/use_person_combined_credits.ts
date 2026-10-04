import { useQuery } from "@tanstack/react-query";
import { getPersonCombinedCredits } from "../../api/tmdb/people/combined_credits";

export function usePersonCombinedCredits(personId: number | null) {
    return useQuery({
        queryKey: ["personCombinedCreditsQuery", personId],
        queryFn: () => getPersonCombinedCredits(personId!),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: personId !== null,
    });
}
