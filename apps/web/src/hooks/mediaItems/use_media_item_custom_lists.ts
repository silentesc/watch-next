import { useQuery } from "@tanstack/react-query";
import { getMediaItemCustomLists } from "../../api/mediaItems/getCustomListItems";

export const mediaItemCustomListsQueryKeyPrefix = ["mediaItemCustomLists"] as const;
export const mediaItemCustomListsQueryKey = (kind: string, external_source: string, external_id: number) => [mediaItemCustomListsQueryKeyPrefix, kind, external_source, external_id] as const;

export function useMediaItemCustomLists(kind: string, external_source: string, external_id: number) {
    return useQuery({
        queryKey: mediaItemCustomListsQueryKey(kind, external_source, external_id),
        queryFn: () => getMediaItemCustomLists({ kind, external_source, external_id }),
        staleTime: 60 * 1000,
        retry: false,
    });
}
