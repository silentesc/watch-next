import { api } from "../client";
import { error2userMessage } from "../errors";

export async function deleteCustomList(list_id: number): Promise<void> {
    try {
        await api.delete(`/custom-lists/${list_id}`);
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
