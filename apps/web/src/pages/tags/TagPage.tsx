import { useState } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import type { MediaItemFiltersSearch } from "../../app/search";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import type { MediaItem } from "../../api/mediaItems/models";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { Checkbox } from "../../components/ui/Checkbox";
import { Dropdown } from "../../components/ui/Dropdown";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { MovieCard } from "../../components/ui/cards/MovieCard";
import { CollectionCard } from "../../components/ui/cards/CollectionCard";
import { TvSeriesCard } from "../../components/ui/cards/TvSeriesCard";
import { type CollectionOverview, type MovieOverview, type TvSeriesOverview } from "../../api/tmdb/models";
import { formatDate } from "../../shared/dateFormatter";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Popup } from "../../components/ui/Popup";
import { PencilIcon, TrashIcon } from "../../components/ui/icons/Icons";
import { useUpdateTag } from "../../hooks/tags/use_update_tag";
import { useDeleteTag } from "../../hooks/tags/use_delete_tag";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useAddCustomListItem } from "../../hooks/customLists/use_add_custom_list_item";
import { useTags } from "../../hooks/tags/use_tags";
import { useTagItems } from "../../hooks/tags/use_tag_items";
import { useTagMediaItem } from "../../hooks/tags/use_tag_media_item";
import { useUntagMediaItem } from "../../hooks/tags/use_untag_media_item";
import { MediaItemFilters } from "../../components/ui/MediaItemFilters";

const getItemKey = (item: MediaItem) => `${item.kind}:${item.external_source}:${item.external_id}`;

export function TagPage() {
    const { id } = useParams({ from: "/tags/$id" });
    const queryParams = useSearch({ from: "/tags/$id" });
    const navigate = useNavigate({ from: "/tags/$id" });
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [isBulkRemovalConfirmationOpen, setIsBulkRemovalConfirmationOpen] = useState(false);
    const [name, setName] = useState("");
    const [titleSearch, setTitleSearch] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedItemKeys, setSelectedItemKeys] = useState<Set<string>>(new Set());
    const updateTag = useUpdateTag();
    const deleteTag = useDeleteTag();
    const customListsQuery = useCustomLists();
    const addCustomListItem = useAddCustomListItem();
    const tagMediaItem = useTagMediaItem();
    const untagMediaItem = useUntagMediaItem();

    const tagId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;
    const tagsQuery = useTags();
    const currentFilters = queryParams;
    const tagItemsQuery = useTagItems(tagId, {
        list_ids: currentFilters.listIds,
        tag_ids: currentFilters.tagIds,
    });
    const tag = tagsQuery.data?.find(tag => tag.id === tagId);

    if (!tagId) {
        return <Error message="No tag id specified" />
    }

    const queryError = tagsQuery.error || tagItemsQuery.error || customListsQuery.error;
    if (queryError) {
        return <Error message={queryError.message} />
    }
    if (tagsQuery.isLoading || tagItemsQuery.isLoading || customListsQuery.isLoading) {
        return <Loading />
    }
    if (!tag || !tagItemsQuery.data) {
        return <Error message="No data returned" />
    }

    const kind = currentFilters.mediaType === "tv" ? "tv_series" : currentFilters.mediaType;
    const searchTerm = titleSearch.trim().toLowerCase();
    const mediaItems = tagItemsQuery.data.filter(item =>
        (!kind || kind === "all" || item.kind === kind)
        && (!searchTerm || item.title?.toLowerCase().includes(searchTerm))
    );
    const selectedItems = mediaItems.filter(item =>
        selectedItemKeys.has(getItemKey(item))
    );
    const areAllItemsSelected = mediaItems.length > 0 && selectedItems.length === mediaItems.length;
    const selectedRequests: TagMediaItemRequest[] = selectedItems.map(item => ({
        kind: item.kind,
        external_source: item.external_source,
        external_id: item.external_id,
    }));
    const otherTags = new Map((tagsQuery.data ?? [])
        .filter(otherTag => otherTag.id !== tagId)
        .map(otherTag => [String(otherTag.id), otherTag.name]));
    const customLists = customListsQuery.data ?? [];
    const listOptions = new Map(customLists.map(list => [String(list.id), list.name]));
    const listRequests: AddCustomListItemRequest[] = selectedItems.map(item => ({
        kind: item.kind,
        external_source: item.external_source,
        external_id: item.external_id,
    }));
    const bulkMutationPending = addCustomListItem.isPending || tagMediaItem.isPending || untagMediaItem.isPending;

    const startEditing = () => {
        setName(tag.name);
        setSelectedItemKeys(new Set());
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setSelectedItemKeys(new Set());
        setIsEditing(false);
    };

    const saveChanges = () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        updateTag.mutate({ tagId: tagId, name: trimmedName }, {
            onSuccess: () => {
                setSelectedItemKeys(new Set());
                setIsEditing(false);
            },
        });
    };

    const toggleItemSelection = (item: typeof mediaItems[number]) => {
        const key = getItemKey(item);
        setSelectedItemKeys(current => {
            const next = new Set(current);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectedItemKeys(areAllItemsSelected
            ? new Set()
            : new Set(mediaItems.map(getItemKey)));
    };

    const addSelectedToTag = (targetTagId: string) => {
        tagMediaItem.mutate({ tagId: Number(targetTagId), items: selectedRequests }, {
            onSuccess: () => setSelectedItemKeys(new Set()),
        });
    };

    const addSelectedToList = (targetListId: string) => {
        addCustomListItem.mutate({ listId: Number(targetListId), items: listRequests }, {
            onSuccess: () => setSelectedItemKeys(new Set()),
        });
    };

    const removeSelectedFromTag = () => {
        setIsBulkRemovalConfirmationOpen(true);
    };

    const confirmRemoveSelectedFromTag = () => {
        untagMediaItem.mutate({ tagId, items: selectedRequests }, {
            onSuccess: () => {
                setSelectedItemKeys(new Set());
                setIsBulkRemovalConfirmationOpen(false);
            },
        });
    };

    const itemCheckbox = (item: typeof mediaItems[number]) => {
        if (!isEditing) return null;
        const key = getItemKey(item);
        const isSelected = selectedItemKeys.has(key);
        return (
            <div className="pointer-events-auto inset-0 absolute" onClick={() => toggleItemSelection(item)}>
                <div className="absolute right-2 top-2">
                    <Checkbox
                        size={20}
                        isSelected={isSelected}
                        onSelect={() => { }}
                        onDeselect={() => { }}
                    />
                </div>
            </div>
        );
    };

    const removeTag = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const confirmRemoveTag = () => {
        deleteTag.mutate(tagId, { onSuccess: () => navigate({ to: "/tags" }) });
    };

    const onFiltersChange = (filters: MediaItemFiltersSearch) => {
        navigate({ search: filters });
        setIsFiltersOpen(false);
    };

    return (
        <>
            <div className="border-b border-background-tertiary p-2 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        {
                            isEditing ? (
                                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                                    <Input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                                    {updateTag.isPending ? <Loading size="medium" /> : null}
                                    <Button value={"Save"} type="button" fullWidth={false} variant="primary" onClick={saveChanges} disabled={!name.trim() || updateTag.isPending} />
                                    <Button value={"Cancel"} type="button" fullWidth={false} onClick={cancelEditing} disabled={!name.trim() || updateTag.isPending} />
                                    <Button value={<span className="flex items-center gap-2"><TrashIcon className="w-5" /> Delete tag</span>} fullWidth={false} onClick={removeTag} variant="danger" disabled={deleteTag.isPending} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-semibold">{tag.name}</h1>
                                    <Button value={<span className="flex items-center gap-2"><PencilIcon className="w-5" /> Edit</span>} fullWidth={false} onClick={startEditing} />
                                </div>
                            )
                        }
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-foreground-secondary">
                            <span>{mediaItems.length} {mediaItems.length === 1 ? "item" : "items"}</span>
                            <span>•</span>
                            <span>Created {formatDate(tag.created_at, "short")}</span>
                            <span>•</span>
                            <span>Updated {formatDate(tag.updated_at, "short")}</span>
                        </div>
                    </div>
                </div>
                {
                    updateTag.error ? (
                        <Error message={updateTag.error.message} />
                    ) : null
                }
                {
                    deleteTag.error ? (
                        <Error message={deleteTag.error.message} />
                    ) : null
                }
                {isEditing && mediaItems.length > 0 ? (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-foreground-secondary">{selectedItems.length} selected</span>
                        <Button
                            value={areAllItemsSelected ? "Deselect all" : "Select all"}
                            fullWidth={false}
                            onClick={toggleSelectAll}
                            disabled={bulkMutationPending}
                        />
                        {selectedItems.length > 0 && bulkMutationPending ? <Loading size="medium" /> : null}
                        {selectedItems.length > 0 && !bulkMutationPending ? (
                            <>
                                {listOptions.size > 0 ? (
                                    <Dropdown title="Add to list" values={listOptions} onSelect={addSelectedToList} />
                                ) : null}
                                {otherTags.size > 0 ? (
                                    <Dropdown title="Add to tag" values={otherTags} onSelect={addSelectedToTag} />
                                ) : null}
                                <Button value="Remove selected" fullWidth={false} variant="danger" onClick={removeSelectedFromTag} />
                            </>
                        ) : null}
                    </div>
                ) : null}
                {tagMediaItem.error ? <Error message={tagMediaItem.error.message} /> : null}
                {addCustomListItem.error ? <Error message={addCustomListItem.error.message} /> : null}
            </div >
            <div>
                <div className="m-2 flex items-center justify-end gap-2">
                    <div className="w-full max-w-100">
                        <Input
                            type="search"
                            placeholder="Search titles"
                            value={titleSearch}
                            onChange={event => setTitleSearch(event.target.value)}
                        />
                    </div>
                    <Button value="Filters" fullWidth={false} onClick={() => setIsFiltersOpen(true)} />
                </div>
                {
                    mediaItems.length === 0 ? (
                        <p>{tagItemsQuery.data.length === 0 ? "No items with this tag" : "No items found"}</p>
                    ) : (
                        <div className="mt-2 grid gap-5 grid-cols-[repeat(auto-fill,minmax(9rem,2fr))] justify-items-center">
                            {mediaItems.map(item => {
                                const key = `${item.kind}${item.external_source}${item.external_id}`;
                                switch (item.kind) {
                                    case "collection":
                                        const collection = {
                                            id: item.external_id, name: item.title, poster_path: item.poster_path,
                                        } as CollectionOverview;
                                        return <CollectionCard key={key} collection={collection}>{itemCheckbox(item)}</CollectionCard>
                                    case "movie":
                                        const movie = {
                                            id: item.external_id, title: item.title, release_date: item.release_date, poster_path: item.poster_path,
                                        } as MovieOverview;
                                        return <MovieCard key={key} movie={movie}>{itemCheckbox(item)}</MovieCard>
                                    case "tv_series":
                                        const tvSeries = {
                                            id: item.external_id, name: item.title, first_air_date: item.release_date, poster_path: item.poster_path,
                                        } as TvSeriesOverview;
                                        return <TvSeriesCard key={key} tvSeries={tvSeries}>{itemCheckbox(item)}</TvSeriesCard>
                                    default:
                                        return <Error key={key} message={`Media item has unknown kind: ${item.kind}`} />
                                }
                            })}
                        </div>
                    )
                }
            </div>

            <MediaItemFilters isOpen={isFiltersOpen} filters={currentFilters} onFiltersChange={onFiltersChange} onClose={() => setIsFiltersOpen(false)} />

            {isDeleteConfirmationOpen ? (
                <Popup onClose={() => setIsDeleteConfirmationOpen(false)} value={
                    <div className="flex flex-col gap-4">
                        {deleteTag.isPending ? <Loading /> : null}
                        <h2 className="text-2xl font-semibold">Delete tag?</h2>
                        <p>Are you sure you want to delete &quot;{tag.name}&quot;?</p>
                        {deleteTag.error ? <Error message={deleteTag.error.message} /> : null}
                        <div className="flex justify-end gap-2">
                            <Button value="Cancel" fullWidth={false} onClick={() => setIsDeleteConfirmationOpen(false)} disabled={deleteTag.isPending} />
                            <Button value="Delete tag" fullWidth={false} variant="danger" onClick={confirmRemoveTag} disabled={deleteTag.isPending} />
                        </div>
                    </div>
                } />
            ) : null}
            {isBulkRemovalConfirmationOpen ? (
                <Popup onClose={untagMediaItem.isPending ? undefined : () => setIsBulkRemovalConfirmationOpen(false)} value={
                    <div className="flex flex-col gap-4">
                        {untagMediaItem.isPending ? <Loading /> : null}
                        <h2 className="text-2xl font-semibold">Remove selected items?</h2>
                        <p>Remove {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} from &quot;{tag.name}&quot;?</p>
                        {untagMediaItem.error ? <Error message={untagMediaItem.error.message} /> : null}
                        <div className="flex justify-end gap-2">
                            <Button value="Cancel" fullWidth={false} onClick={() => setIsBulkRemovalConfirmationOpen(false)} disabled={untagMediaItem.isPending} />
                            <Button value="Remove" fullWidth={false} variant="danger" onClick={confirmRemoveSelectedFromTag} disabled={untagMediaItem.isPending} />
                        </div>
                    </div>
                } />
            ) : null}
        </>

    );
}
