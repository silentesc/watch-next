import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "../../api/tags/deleteTag";
import { tagItemsQueryKey } from "./use_tag_items";
import { tagsQueryKey } from "./use_tags";
import { mediaItemTagsQueryKeyPrefix } from "../mediaItems/use_media_item_tags";

export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTag,
        onSuccess: (_data, tagId) => Promise.all([
            queryClient.invalidateQueries({ queryKey: tagItemsQueryKey(tagId), refetchType: "none" }),
            queryClient.invalidateQueries({ queryKey: tagsQueryKey }),
            queryClient.invalidateQueries({ queryKey: mediaItemTagsQueryKeyPrefix }),
        ]),
    });
}
