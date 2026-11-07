import { api } from "../client";
import { error2userMessage } from "../errors";

export interface TagMediaItemRequest {
    kind: string;
    external_source: string;
    external_id: number;
}

export async function tagMediaItem(tag_id: number, item: TagMediaItemRequest): Promise<void> {
    try {
        await api.post(`/tags/${tag_id}/items`, { items: [item] });
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
