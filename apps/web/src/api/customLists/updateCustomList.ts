import { api } from "../client";
import { error2userMessage } from "../errors";

export async function updateCustomList(list_id: number, name: string): Promise<void> {
    try {
        await api.put(`/custom-lists/${list_id}`, { name });
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
