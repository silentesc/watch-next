import { api } from "../client";
import { error2userMessage } from "../errors";
import type { AddCustomListItemRequest } from "./addCustomListItem";

export async function deleteCustomListItem(list_id: number, items: AddCustomListItemRequest[]): Promise<void> {
    try {
        await api.delete(`/custom-lists/${list_id}/items`, { data: { items } });
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
