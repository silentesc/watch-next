import { api } from "../client";
import { error2userMessage } from "../errors";
import type { MediaItem, MediaItemFilterParams } from "../mediaItems/models";

export async function getTagItems(tag_id: number, filters?: MediaItemFilterParams): Promise<Array<MediaItem>> {
    try {
        const response = await api.get<Array<MediaItem>>(`/tags/${tag_id}/items`, { params: filters });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
