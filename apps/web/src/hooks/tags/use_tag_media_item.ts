import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagMediaItem } from "../../api/tags/tagMediaItem";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { tagItemsQueryKey } from "./use_tag_items";

interface TagMediaItemVariables {
    tagId: number;
    item: TagMediaItemRequest;
}

export function useTagMediaItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tagId, item }: TagMediaItemVariables) => tagMediaItem(tagId, item),
        onSuccess: (_data, { tagId }) => queryClient.invalidateQueries({ queryKey: tagItemsQueryKey(tagId) }),
    });
}
