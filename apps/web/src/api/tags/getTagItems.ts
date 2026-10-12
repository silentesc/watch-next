import { api } from "../client";
import { error2userMessage } from "../errors";
import type { MediaItemTree } from "./models";

export async function getTagItems(tag_id: number): Promise<Array<MediaItemTree>> {
    try {
        const response = await api.get<Array<MediaItemTree>>(`/tags/${tag_id}/items`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
