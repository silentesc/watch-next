import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { Keyword } from "../models";

export interface TvSeriesKeywordsResponse {
    id: number;
    results: Array<Keyword>;
}

export async function getTvSeriesKeywords(seriesId: number): Promise<TvSeriesKeywordsResponse> {
    try {
        const response = await api.get<TvSeriesKeywordsResponse>(`tv/${seriesId}/keywords`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
