import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomListItem } from "../../api/customLists/deleteCustomListItem";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { customListItemsQueryKey } from "./use_custom_list_items";
import { customListsQueryKey } from "./use_custom_lists";
import { mediaItemCustomListsQueryKey } from "../mediaItems/use_media_item_custom_lists";

interface DeleteCustomListItemVariables {
    listId: number;
    items: AddCustomListItemRequest[];
}

export function useDeleteCustomListItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listId, items }: DeleteCustomListItemVariables) => deleteCustomListItem(listId, items),
        onSuccess: (_data, { listId, items }) => {
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: customListItemsQueryKey(listId) }),
                queryClient.invalidateQueries({ queryKey: customListsQueryKey }),
                ...items.map(item => queryClient.invalidateQueries({
                    queryKey: mediaItemCustomListsQueryKey(item.kind, item.external_source, item.external_id),
                })),
            ]);
        },
    });
}
