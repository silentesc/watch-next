import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { MultiSearchResult } from "../models";

export interface TrendingAllResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: Array<MultiSearchResult>;
}

export async function getTrendingAll(
    timeWindow: "day" | "week",
    page?: number,
    language?: string,
): Promise<TrendingAllResponse> {
    try {
        const response = await api.get<TrendingAllResponse>(`/trending/all/${timeWindow}`, {
            params: { page, language },
        });
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
