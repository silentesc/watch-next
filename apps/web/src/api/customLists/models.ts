export interface CustomList {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    preview_posters: Array<string>;
}

export interface MediaItem {
    kind: string;
    title: string | null;
    poster_path: string | null;
    release_date: string | null;
    external_source: string;
    external_id: number;
}
