import { useQuery } from "@tanstack/react-query";
import { getCustomListItems } from "../../api/customLists/getCustomListItems";
import type { MediaItemFilterParams } from "../../api/mediaItems/models";

export const customListItemsQueryKey = (listId: number, filters?: MediaItemFilterParams) =>
    filters?.list_ids || filters?.tag_ids
        ? ["customListItems", listId, filters] as const
        : ["customListItems", listId] as const;

export function useCustomListItems(listId: number | null, filters?: MediaItemFilterParams) {
    return useQuery({
        queryKey: customListItemsQueryKey(listId!, filters),
        queryFn: () => getCustomListItems(listId!, filters),
        staleTime: 60 * 1000,
        retry: false,
        enabled: listId !== null,
    });
}
