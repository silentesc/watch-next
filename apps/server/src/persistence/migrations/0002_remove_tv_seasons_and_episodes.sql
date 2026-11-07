DELETE FROM media_items
WHERE kind IN ('tv_season', 'tv_episode');

ALTER TABLE media_items
    DROP CONSTRAINT IF EXISTS media_items_kind_check,
    DROP CONSTRAINT IF EXISTS media_items_check,
    DROP CONSTRAINT IF EXISTS media_items_kind_external_source_external_id_parent_id_seas_key;

ALTER TABLE media_items
    ADD CONSTRAINT media_items_kind_check
        CHECK (kind IN ('collection', 'movie', 'tv_series'));

ALTER TABLE media_items
    ADD CONSTRAINT media_items_kind_external_source_external_id_key
        UNIQUE (kind, external_source, external_id);

ALTER TABLE media_items
    DROP COLUMN IF EXISTS parent_id,
    DROP COLUMN IF EXISTS season_number,
    DROP COLUMN IF EXISTS episode_number;
