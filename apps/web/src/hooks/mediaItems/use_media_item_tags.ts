import { useQuery } from "@tanstack/react-query";
import { getMediaItemTags } from "../../api/mediaItems/getTagItems";

export const mediaItemTagsQueryKeyPrefix = ["mediaItemTags"] as const;
export const mediaItemTagsQueryKey = (
    kind: string, external_source: string, external_id: number, season_number?: number, episode_number?: number
) => [...mediaItemTagsQueryKeyPrefix, kind, external_source, external_id, season_number, episode_number] as const;

export function useMediaItemTags(kind: string, external_source: string, external_id: number, season_number?: number, episode_number?: number) {
    return useQuery({
        queryKey: mediaItemTagsQueryKey(kind, external_source, external_id, season_number, episode_number),
        queryFn: () => getMediaItemTags({ kind, external_source, external_id, season_number, episode_number }),
        staleTime: 60 * 1000,
        retry: false,
    });
}
