import { api } from "../client";
import { error2userMessage } from "../errors";

export interface TagMediaItemRequest {
    kind: string;
    external_source: string;
    external_id: number;
    season_number?: number;
    episode_number?: number;
}

export async function tagMediaItem(tag_id: number, item: TagMediaItemRequest): Promise<void> {
    try {
        await api.post(`/tags/${tag_id}/items`, item);
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
