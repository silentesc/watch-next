import { api } from "../client";
import { error2userMessage } from "../errors";
import type { MediaItem } from "./models";

export async function getCustomListItems(list_id: number): Promise<Array<MediaItem>> {
    try {
        const response = await api.get<Array<MediaItem>>(`/custom-lists/${list_id}/items`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
