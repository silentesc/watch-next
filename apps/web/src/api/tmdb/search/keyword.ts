import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { Keyword } from "../models";

export interface SearchKeywordResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<Keyword>;
}

export async function search_keyword(query: string, page?: number): Promise<SearchKeywordResponse> {
    try {
        const response = await api.get<SearchKeywordResponse>("/search/keyword", { params: { query, page } });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
