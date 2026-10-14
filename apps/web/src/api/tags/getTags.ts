import { api } from "../client";
import { error2userMessage } from "../errors";
import type { Tag } from "./models";

export async function getTags(): Promise<Array<Tag>> {
    try {
        const response = await api.get<Array<Tag>>("/tags");
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
