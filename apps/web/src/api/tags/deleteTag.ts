import { api } from "../client";
import { error2userMessage } from "../errors";

export async function deleteTag(tag_id: number): Promise<void> {
    try {
        await api.delete(`/tags/${tag_id}`);
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}

