import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomList } from "../../api/customLists/updateCustomList";
import { customListsQueryKey } from "./use_custom_lists";
import { mediaItemCustomListsQueryKeyPrefix } from "../mediaItems/use_media_item_custom_lists";

interface UpdateCustomListVariables {
    listId: number;
    name: string;
}

export function useUpdateCustomList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listId, name }: UpdateCustomListVariables) => updateCustomList(listId, name),
        onSuccess: () => {
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: customListsQueryKey }),
                queryClient.invalidateQueries({ queryKey: mediaItemCustomListsQueryKeyPrefix }),
            ]);
        },
    });
}
