import { api } from "../client";
import { error2userMessage } from "../errors";

export interface CreateCustomListResponse {
    id: number;
}

export async function createCustomList(name: string): Promise<CreateCustomListResponse> {
    try {
        const response = await api.post<CreateCustomListResponse>("/custom-lists", { name });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
