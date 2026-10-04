import { api } from "../client";
import { error2userMessage } from "../errors";
import type { CustomList } from "./models";

export async function getCustomLists(): Promise<Array<CustomList>> {
    try {
        const response = await api.get<Array<CustomList>>("/custom-lists");
        return response.data;
    } catch (err) {
        throw new Error(error2userMessage(err));
    }
}
