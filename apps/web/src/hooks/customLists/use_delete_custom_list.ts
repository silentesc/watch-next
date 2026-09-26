import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomList } from "../../api/customLists/deleteCustomList";
import { customListItemsQueryKey } from "./use_custom_list_items";
import { customListsQueryKey } from "./use_custom_lists";

export function useDeleteCustomList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomList,
        onSuccess: (_data, listId) => {
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: customListItemsQueryKey(listId), refetchType: "none" }),
                queryClient.invalidateQueries({ queryKey: customListsQueryKey }),
            ]);
        },
    });
}
