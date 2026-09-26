import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomListItem } from "../../api/customLists/deleteCustomListItem";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { customListItemsQueryKey } from "./use_custom_list_items";
import { customListsQueryKey } from "./use_custom_lists";

interface DeleteCustomListItemVariables {
    listId: number;
    item: AddCustomListItemRequest;
}

export function useDeleteCustomListItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listId, item }: DeleteCustomListItemVariables) => deleteCustomListItem(listId, item),
        onSuccess: (_data, { listId }) => {
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: customListItemsQueryKey(listId) }),
                queryClient.invalidateQueries({ queryKey: customListsQueryKey }),
            ]);
        },
    });
}
