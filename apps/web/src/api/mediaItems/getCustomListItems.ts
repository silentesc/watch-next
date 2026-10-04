import { api } from "../client";
import type { CustomList } from "../customLists/models";
import { error2userMessage } from "../errors";

export interface GetMediaItemCustomListsRequest {
    kind: string;
    external_source: string;
    external_id: number;
}

export async function getMediaItemCustomLists(item: GetMediaItemCustomListsRequest): Promise<Array<CustomList>> {
    try {
        const response = await api.get<Array<CustomList>>(`/media-items/custom-lists`, { params: item });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
