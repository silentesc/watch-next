import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { MultiSearchResult } from "../models";

export interface SearchMultiResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<MultiSearchResult>;
}

export async function search_multi(query: string, page?: number): Promise<SearchMultiResponse> {
    try {
        const response = await api.get<SearchMultiResponse>("/search/multi", { params: { query, page } });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
