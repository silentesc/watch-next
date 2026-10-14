import { api } from "../client";
import { error2userMessage } from "../errors";
import type { TagMediaItemRequest } from "./tagMediaItem";

export async function untagMediaItem(tag_id: number, item: TagMediaItemRequest): Promise<void> {
    try {
        await api.delete(`/tags/${tag_id}/items`, { params: item });
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
