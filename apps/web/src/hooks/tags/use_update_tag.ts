import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag } from "../../api/tags/updateTag";
import { tagsQueryKey } from "./use_tags";
import { mediaItemTagsQueryKeyPrefix } from "../mediaItems/use_media_item_tags";

interface UpdateTagVariables {
    tagId: number;
    name: string;
}

export function useUpdateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tagId, name }: UpdateTagVariables) => updateTag(tagId, name),
        onSuccess: () => {
            return Promise.all([
                queryClient.invalidateQueries({ queryKey: tagsQueryKey }),
                queryClient.invalidateQueries({ queryKey: mediaItemTagsQueryKeyPrefix }),
            ]);
        },
    });
}
