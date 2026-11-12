import { useQuery } from "@tanstack/react-query";
import { getTagItems } from "../../api/tags/getTagItems";
import type { MediaItemFilterParams } from "../../api/mediaItems/models";

export const tagItemsQueryKey = (tagId: number, filters?: MediaItemFilterParams) =>
    filters?.list_ids || filters?.tag_ids
        ? ["tagItems", tagId, filters] as const
        : ["tagItems", tagId] as const;

export function useTagItems(tagId: number | null, filters?: MediaItemFilterParams) {
    return useQuery({
        queryKey: tagItemsQueryKey(tagId!, filters),
        queryFn: () => getTagItems(tagId!, filters),
        staleTime: 60 * 1000,
        retry: false,
        enabled: tagId !== null,
    });
}
