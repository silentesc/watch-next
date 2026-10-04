import { useQuery } from "@tanstack/react-query";
import { getPersonDetails } from "../../api/tmdb/people/details";

export function usePersonDetails(personId: number | null) {
    return useQuery({
        queryKey: ["personDetailsQuery", personId],
        queryFn: () => getPersonDetails(personId!),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: personId !== null,
    });
}
