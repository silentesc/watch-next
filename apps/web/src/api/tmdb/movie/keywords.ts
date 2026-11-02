import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { Keyword } from "../models";

export interface MovieKeywordsResponse {
    id: number;
    keywords: Array<Keyword>;
}

export async function getMovieKeywords(movieId: number): Promise<MovieKeywordsResponse> {
    try {
        const response = await api.get<MovieKeywordsResponse>(`movie/${movieId}/keywords`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
