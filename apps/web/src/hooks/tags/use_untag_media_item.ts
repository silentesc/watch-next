import { useMutation, useQueryClient } from "@tanstack/react-query";
import { untagMediaItem } from "../../api/tags/untagMediaItem";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { tagItemsQueryKey } from "./use_tag_items";

interface UntagMediaItemVariables {
    tagId: number;
    item: TagMediaItemRequest;
}

export function useUntagMediaItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tagId, item }: UntagMediaItemVariables) => untagMediaItem(tagId, item),
        onSuccess: (_data, { tagId }) => queryClient.invalidateQueries({ queryKey: tagItemsQueryKey(tagId) }),
    });
}
