import { useQuery } from "@tanstack/react-query";
import { getCustomListItems } from "../../api/customLists/getCustomListItems";

export const customListItemsQueryKey = (listId: number) => ["customListItems", listId] as const;

export function useCustomListItems(listId: number | null) {
    return useQuery({
        queryKey: customListItemsQueryKey(listId!),
        queryFn: () => getCustomListItems(listId!),
        staleTime: 60 * 1000,
        retry: false,
        enabled: listId !== null,
    });
}
