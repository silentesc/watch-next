import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { Keyword } from "../models";

export async function getKeywordDetails(keywordId: number): Promise<Keyword> {
    try {
        const response = await api.get<Keyword>(`keyword/${keywordId}`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
