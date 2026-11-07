import { useMutation, useQueryClient } from "@tanstack/react-query";
import { untagMediaItem } from "../../api/tags/untagMediaItem";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { tagItemsQueryKey } from "./use_tag_items";
import { tagsQueryKey } from "./use_tags";
import { mediaItemTagsQueryKey } from "../mediaItems/use_media_item_tags";

interface UntagMediaItemVariables {
    tagId: number;
    items: TagMediaItemRequest[];
}

export function useUntagMediaItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tagId, items }: UntagMediaItemVariables) => untagMediaItem(tagId, items),
        onSuccess: (_data, { tagId, items }) => Promise.all([
            queryClient.invalidateQueries({ queryKey: tagItemsQueryKey(tagId) }),
            queryClient.invalidateQueries({ queryKey: tagsQueryKey }),
            ...items.map(item => queryClient.invalidateQueries({
                queryKey: mediaItemTagsQueryKey(item.kind, item.external_source, item.external_id),
            })),
        ]),
    });
}
