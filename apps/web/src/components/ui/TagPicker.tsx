import { useState } from "react";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { useMediaItemTags } from "../../hooks/mediaItems/use_media_item_tags";
import { useTagMediaItem } from "../../hooks/tags/use_tag_media_item";
import { useTags } from "../../hooks/tags/use_tags";
import { useUntagMediaItem } from "../../hooks/tags/use_untag_media_item";
import { Button } from "./Button";
import { Error } from "./Error";
import { TagIcon } from "./icons/Icons";
import { Loading } from "./Loading";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { Popup } from "./Popup";
import { Tag } from "./Tag";

interface TagPickerProps {
    item: TagMediaItemRequest;
    mode: "dropdown" | "popup";
}

interface TagPickerModeProps {
    selectedKeys: Array<string>,
    loadingKeys: Set<string>,
    values: Map<string, string>,
    onTag: (tagIdString: string) => void,
    onUntag: (tagIdString: string) => void,
}

function TagPickerDropdown({ selectedKeys, loadingKeys, values, onTag, onUntag }: TagPickerModeProps) {
    return (
        <MultiSelectDropdown
            placeholder="Tags"
            selectedKeys={selectedKeys}
            loadingKeys={loadingKeys}
            values={values}
            onSelect={onTag}
            onDeselect={onUntag}
        />
    );
}

function TagPickerPopup({ selectedKeys, loadingKeys, values, onTag, onUntag }: TagPickerModeProps) {
    const [isOpen, setIsOpen] = useState(false);

    const onTagClick = (tagId: string) => {
        if (loadingKeys.has(tagId)) return;
        selectedKeys.includes(tagId) ? onUntag(tagId) : onTag(tagId);
    };

    return (
        <>
            <Button value={
                <div className="flex gap-1.5 items-center">
                    <TagIcon className="w-4 h-4" />
                    <span className={`${selectedKeys.length > 0 ? "opacity-80" : "opacity-60"} text-sm leading-0 font-medium`}>{selectedKeys.length}</span>
                </div>
            } fullWidth={false} onClick={() => setIsOpen(true)} />
            {
                isOpen ? (
                    <Popup onClose={() => setIsOpen(false)} value={
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-semibold">Select tags</h2>
                            <div className="flex flex-wrap gap-3">
                                {Array.from(values.entries()).map(
                                    ([id, name]) => {
                                        const variant = selectedKeys.includes(id) ? "primary" : "default";
                                        return (
                                            <Tag key={id} name={name} variant={variant} isLoading={loadingKeys.has(id)} onClick={() => onTagClick(id)} />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    } />
                ) : null
            }
        </>
    );
}

const loadingKeys: Set<string> = new Set();

export function TagPicker({ item, mode }: TagPickerProps) {
    const tagsQuery = useTags();
    const mediaItemTagsQuery = useMediaItemTags(item.kind, item.external_source, item.external_id, item.season_number, item.episode_number);
    const tagMediaItem = useTagMediaItem();
    const untagMediaItem = useUntagMediaItem();
    const queryError = tagsQuery.error || mediaItemTagsQuery.error;

    if (queryError) {
        return <Error message={queryError.message} />;
    }

    if (tagsQuery.isLoading || mediaItemTagsQuery.isLoading) {
        return <Loading />;
    }
    if (!tagsQuery.data?.length) {
        return null;
    }

    const mediaItemTagIds = new Set((mediaItemTagsQuery.data ?? []).map((tag) => tag.id));

    const selectedKeys = Array.from(mediaItemTagIds, (id) => String(id));
    const values = new Map(tagsQuery.data.map((tag) => [String(tag.id), tag.name]));

    const tag = async (tagIdString: string) => {
        loadingKeys.add(tagIdString);
        await tagMediaItem.mutateAsync({ tagId: Number(tagIdString), item });
        loadingKeys.delete(tagIdString);
    };

    const untag = async (tagIdString: string) => {
        loadingKeys.add(tagIdString);
        await untagMediaItem.mutateAsync({ tagId: Number(tagIdString), item });
        loadingKeys.delete(tagIdString);
    };

    const mutationError = tagMediaItem.error || untagMediaItem.error;

    return (
        <div className="w-fit flex flex-col gap-2 items-start">
            {
                mode === "dropdown" ? (
                    <TagPickerDropdown
                        selectedKeys={selectedKeys}
                        loadingKeys={loadingKeys}
                        values={values}
                        onTag={tag}
                        onUntag={untag}
                    />
                ) : mode === "popup" ? (
                    <TagPickerPopup
                        selectedKeys={selectedKeys}
                        loadingKeys={loadingKeys}
                        values={values}
                        onTag={tag}
                        onUntag={untag}
                    />
                ) : null
            }
            {mutationError ? <Error message={mutationError.message} /> : null}
        </div>
    );
}
