import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCustomListItem } from "../../api/customLists/addCustomListItem";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { customListItemsQueryKey } from "./use_custom_list_items";

interface AddCustomListItemVariables {
    listId: number;
    item: AddCustomListItemRequest;
}

export function useAddCustomListItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listId, item }: AddCustomListItemVariables) => addCustomListItem(listId, item),
        onSuccess: (_data, { listId }) => {
            return queryClient.invalidateQueries({ queryKey: customListItemsQueryKey(listId) });
        },
    });
}
