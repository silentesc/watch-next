import { api } from "../client";
import { error2userMessage } from "../errors";

export async function updateTag(tag_id: number, name: string): Promise<void> {
    try {
        await api.put(`/tags/${tag_id}`, { name });
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
