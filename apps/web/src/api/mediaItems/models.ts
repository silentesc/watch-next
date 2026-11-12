export interface MediaItem {
    kind: string;
    title: string | null;
    poster_path: string | null;
    release_date: string | null;
    external_source: string;
    external_id: number;
}

export interface MediaItemFilterParams {
    list_ids?: string;
    tag_ids?: string;
}
