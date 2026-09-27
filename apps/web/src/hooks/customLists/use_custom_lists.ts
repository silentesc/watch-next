import { useQuery } from "@tanstack/react-query";
import { getCustomLists } from "../../api/customLists/getCustomLists";

export const customListsQueryKey = ["customLists"] as const;

export function useCustomLists() {
    return useQuery({
        queryKey: customListsQueryKey,
        queryFn: getCustomLists,
        staleTime: 60 * 1000,
        retry: false,
    });
}
