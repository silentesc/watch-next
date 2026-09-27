import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomList } from "../../api/customLists/createCustomList";
import { customListsQueryKey } from "./use_custom_lists";

export function useCreateCustomList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCustomList,
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: customListsQueryKey });
        },
    });
}
