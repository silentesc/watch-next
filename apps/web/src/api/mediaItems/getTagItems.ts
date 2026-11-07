import { api } from "../client";
import { error2userMessage } from "../errors";
import type { Tag } from "../tags/models";

export interface GetMediaItemTagsRequest {
    kind: string;
    external_source: string;
    external_id: number;
}

export async function getMediaItemTags(item: GetMediaItemTagsRequest): Promise<Array<Tag>> {
    try {
        const response = await api.get<Array<Tag>>(`/media-items/tags`, { params: item });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
