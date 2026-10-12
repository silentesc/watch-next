import { useMutation, useQueryClient } from "@tanstack/react-query";
import { untagMediaItem } from "../../api/tags/untagMediaItem";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { tagItemsQueryKey } from "./use_tag_items";
import { tagsQueryKey } from "./use_tags";
import { mediaItemTagsQueryKey } from "../mediaItems/use_media_item_tags";

interface UntagMediaItemVariables {
    tagId: number;
    item: TagMediaItemRequest;
}

export function useUntagMediaItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tagId, item }: UntagMediaItemVariables) => untagMediaItem(tagId, item),
        onSuccess: (_data, { tagId, item }) => Promise.all([
            queryClient.invalidateQueries({ queryKey: tagItemsQueryKey(tagId) }),
            queryClient.invalidateQueries({ queryKey: tagsQueryKey }),
            queryClient.invalidateQueries({ queryKey: mediaItemTagsQueryKey(item.kind, item.external_source, item.external_id, item.season_number, item.episode_number) }),
        ]),
    });
}
