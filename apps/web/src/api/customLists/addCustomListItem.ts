import { api } from "../client";
import { error2userMessage } from "../errors";

export interface AddCustomListItemRequest {
    kind: string;
    external_source: string;
    external_id: number;
}

export async function addCustomListItem(list_id: number, item: AddCustomListItemRequest): Promise<void> {
    try {
        await api.post(`/custom-lists/${list_id}/items`, item);
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
