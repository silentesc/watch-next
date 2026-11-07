import { api } from "../client";
import { error2userMessage } from "../errors";
import type { TagMediaItemRequest } from "./tagMediaItem";

export async function untagMediaItem(tag_id: number, items: TagMediaItemRequest[]): Promise<void> {
    try {
        await api.delete(`/tags/${tag_id}/items`, { data: { items } });
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
