import { useQuery } from "@tanstack/react-query";
import { getTagItems } from "../../api/tags/getTagItems";

export const tagItemsQueryKey = (tagId: number) => ["tagItems", tagId] as const;

export function useTagItems(tagId: number | null) {
    return useQuery({
        queryKey: tagItemsQueryKey(tagId!),
        queryFn: () => getTagItems(tagId!),
        staleTime: 60 * 1000,
        retry: false,
        enabled: tagId !== null,
    });
}
