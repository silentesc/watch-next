import { useQuery } from "@tanstack/react-query";
import { getTags } from "../../api/tags/getTags";

export const tagsQueryKey = ["tags"] as const;

export function useTags() {
    return useQuery({
        queryKey: tagsQueryKey,
        queryFn: getTags,
        staleTime: 60 * 1000,
        retry: false,
    });
}
