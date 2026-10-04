import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCustomListItem } from "../../api/customLists/addCustomListItem";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import { customListItemsQueryKey } from "./use_custom_list_items";
import { customListsQueryKey } from "./use_custom_lists";
import { mediaItemCustomListsQueryKey } from "../mediaItems/use_media_item_custom_lists";

interface AddCustomListItemVariables {
    listId: number;
    item: AddCustomListItemRequest;
}

export function useAddCustomListItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listId, item }: AddCustomListItemVariables) => addCustomListItem(listId, item),
        onSuccess: (_data, { listId, item }) => {
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: customListItemsQueryKey(listId) }),
                queryClient.invalidateQueries({ queryKey: customListsQueryKey }),
                queryClient.invalidateQueries({ queryKey: mediaItemCustomListsQueryKey(item.kind, item.external_source, item.external_id) }),
            ]);
        },
    });
}
