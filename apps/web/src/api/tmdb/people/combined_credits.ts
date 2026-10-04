import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { PersonCombinedCredit } from "../models";

interface PersonCombinedCreditsResponse {
    id: number;
    cast: Array<PersonCombinedCredit>;
    crew: Array<PersonCombinedCredit>;
}

export async function getPersonCombinedCredits(person_id: number): Promise<PersonCombinedCreditsResponse> {
    try {
        const response = await api.get<PersonCombinedCreditsResponse>(`person/${person_id}/combined_credits`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
