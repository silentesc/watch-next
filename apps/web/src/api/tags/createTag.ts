import { api } from "../client";
import { error2userMessage } from "../errors";

export interface CreateTagResponse {
    id: number;
}

export async function createTag(name: string): Promise<CreateTagResponse> {
    try {
        const response = await api.post<CreateTagResponse>("/tags", { name });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
