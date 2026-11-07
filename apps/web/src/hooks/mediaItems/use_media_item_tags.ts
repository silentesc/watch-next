import { useQuery } from "@tanstack/react-query";
import { getMediaItemTags } from "../../api/mediaItems/getTagItems";

export const mediaItemTagsQueryKeyPrefix = ["mediaItemTags"] as const;
export const mediaItemTagsQueryKey = (
    kind: string, external_source: string, external_id: number
) => [...mediaItemTagsQueryKeyPrefix, kind, external_source, external_id] as const;

export function useMediaItemTags(kind: string, external_source: string, external_id: number) {
    return useQuery({
        queryKey: mediaItemTagsQueryKey(kind, external_source, external_id),
        queryFn: () => getMediaItemTags({ kind, external_source, external_id }),
        staleTime: 60 * 1000,
        retry: false,
    });
}
