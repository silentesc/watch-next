import { useQuery } from "@tanstack/react-query";
import { me } from "../api/me";
import { useAuthStore } from "../stores/useAuthStore";

export const meQueryKey = ["me"] as const;

export function useMe() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    return useQuery({
        queryKey: meQueryKey,
        queryFn: me,
        staleTime: Infinity,
        retry: false,
        enabled: isLoggedIn,
    });
}
