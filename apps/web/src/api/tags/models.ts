export interface Tag {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface MediaItemTree {
    kind: string;
    title: string | null;
    poster_path: string | null;
    release_date: string | null;
    external_source: string;
    external_id: number;
    parent: MediaItemTree | null;
    season_number: number | null;
    episode_number: number | null;
}
