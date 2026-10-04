import { api } from "../../client";
import { error2userMessage } from "../../errors";
import type { PersonDetails } from "../models";

export async function getPersonDetails(person_id: number): Promise<PersonDetails> {
    try {
        const response = await api.get<PersonDetails>(`person/${person_id}`);
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
