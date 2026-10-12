import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "../../api/tags/createTag";
import { tagsQueryKey } from "./use_tags";

export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTag,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: tagsQueryKey }),
    });
}
