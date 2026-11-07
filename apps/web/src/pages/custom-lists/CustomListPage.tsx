import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { AddCustomListItemRequest } from "../../api/customLists/addCustomListItem";
import type { TagMediaItemRequest } from "../../api/tags/tagMediaItem";
import { Checkbox } from "../../components/ui/Checkbox";
import { Dropdown } from "../../components/ui/Dropdown";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useCustomListItems } from "../../hooks/customLists/use_custom_list_items";
import { MovieCard } from "../../components/ui/cards/MovieCard";
import { CollectionCard } from "../../components/ui/cards/CollectionCard";
import { TvSeriesCard } from "../../components/ui/cards/TvSeriesCard";
import { type CollectionOverview, type MovieOverview, type TvSeriesOverview } from "../../api/tmdb/models";
import { formatDate } from "../../shared/dateFormatter";
import { useDeleteCustomList } from "../../hooks/customLists/use_delete_custom_list";
import { useUpdateCustomList } from "../../hooks/customLists/use_update_custom_list";
import { useAddCustomListItem } from "../../hooks/customLists/use_add_custom_list_item";
import { useDeleteCustomListItem } from "../../hooks/customLists/use_delete_custom_list_item";
import { useTags } from "../../hooks/tags/use_tags";
import { useTagMediaItem } from "../../hooks/tags/use_tag_media_item";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Popup } from "../../components/ui/Popup";
import { PencilIcon, TrashIcon } from "../../components/ui/icons/Icons";

export function CustomListPage() {
    const { id } = useParams({ from: "/custom-lists/$id" });
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [isBulkRemovalConfirmationOpen, setIsBulkRemovalConfirmationOpen] = useState(false);
    const [name, setName] = useState("");
    const [selectedItemKeys, setSelectedItemKeys] = useState<Set<string>>(new Set());
    const updateCustomList = useUpdateCustomList();
    const deleteCustomList = useDeleteCustomList();
    const addCustomListItem = useAddCustomListItem();
    const deleteCustomListItem = useDeleteCustomListItem();
    const tagsQuery = useTags();
    const tagMediaItem = useTagMediaItem();

    const listId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;
    const customListsQuery = useCustomLists();
    const customListItemsQuery = useCustomListItems(listId);
    const customList = customListsQuery.data?.find(list => list.id === listId);

    if (!listId) {
        return <Error message="No list id specified" />
    }

    const queryError = customListsQuery.error || customListItemsQuery.error || tagsQuery.error;
    if (queryError) {
        return <Error message={queryError.message} />
    }
    if (customListsQuery.isLoading || customListItemsQuery.isLoading || tagsQuery.isLoading) {
        return <Loading />
    }
    if (!customList || !customListItemsQuery.data) {
        return <Error message="No data returned" />
    }

    const mediaItems = customListItemsQuery.data;
    const selectedItems = mediaItems.filter(item =>
        selectedItemKeys.has(`${item.kind}:${item.external_source}:${item.external_id}`)
    );
    const areAllItemsSelected = mediaItems.length > 0 && selectedItems.length === mediaItems.length;
    const selectedRequests: AddCustomListItemRequest[] = selectedItems.map(item => ({
        kind: item.kind,
        external_source: item.external_source,
        external_id: item.external_id,
    }));
    const otherLists = new Map((customListsQuery.data ?? [])
        .filter(otherList => otherList.id !== listId)
        .map(otherList => [String(otherList.id), otherList.name]));
    const tagOptions = new Map((tagsQuery.data ?? []).map(tag => [String(tag.id), tag.name]));
    const tagRequests: TagMediaItemRequest[] = selectedItems.map(item => ({
        kind: item.kind,
        external_source: item.external_source,
        external_id: item.external_id,
    }));
    const bulkMutationPending = addCustomListItem.isPending || deleteCustomListItem.isPending || tagMediaItem.isPending;

    const startEditing = () => {
        setName(customList.name);
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
        updateCustomList.mutate({ listId, name: trimmedName }, {
            onSuccess: () => {
                setSelectedItemKeys(new Set());
                setIsEditing(false);
            },
        });
    };

    const toggleItemSelection = (item: typeof mediaItems[number]) => {
        const key = `${item.kind}:${item.external_source}:${item.external_id}`;
        setSelectedItemKeys(current => {
            const next = new Set(current);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectedItemKeys(areAllItemsSelected
            ? new Set()
            : new Set(mediaItems.map(item => `${item.kind}:${item.external_source}:${item.external_id}`)));
    };

    const addSelectedToList = (targetListId: string) => {
        addCustomListItem.mutate({ listId: Number(targetListId), items: selectedRequests }, {
            onSuccess: () => setSelectedItemKeys(new Set()),
        });
    };

    const addSelectedToTag = (targetTagId: string) => {
        tagMediaItem.mutate({ tagId: Number(targetTagId), items: tagRequests }, {
            onSuccess: () => setSelectedItemKeys(new Set()),
        });
    };

    const removeSelectedFromList = () => {
        setIsBulkRemovalConfirmationOpen(true);
    };

    const confirmRemoveSelectedFromList = () => {
        deleteCustomListItem.mutate({ listId, items: selectedRequests }, {
            onSuccess: () => {
                setSelectedItemKeys(new Set());
                setIsBulkRemovalConfirmationOpen(false);
            },
        });
    };

    const itemCheckbox = (item: typeof mediaItems[number]) => {
        if (!isEditing) return null;
        const key = `${item.kind}:${item.external_source}:${item.external_id}`;
        const isSelected = selectedItemKeys.has(key);
        return (
            <div className="pointer-events-auto absolute right-1 top-1 p-1">
                <Checkbox
                    size={20}
                    isSelected={isSelected}
                    onSelect={() => toggleItemSelection(item)}
                    onDeselect={() => toggleItemSelection(item)}
                />
            </div>
        );
    };

    const removeList = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const confirmRemoveList = () => {
        deleteCustomList.mutate(listId, { onSuccess: () => navigate({ to: "/custom-lists" }) });
    };

    return (
        <>
            <div className="mb-8 border-b border-background-tertiary p-2 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        {
                            isEditing ? (
                                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                                    <Input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                                    {updateCustomList.isPending ? <Loading size="medium" /> : null}
                                    <Button value={"Save"} type="button" fullWidth={false} variant="primary" onClick={saveChanges} disabled={!name.trim() || updateCustomList.isPending} />
                                    <Button value={"Cancel"} type="button" fullWidth={false} onClick={cancelEditing} disabled={!name.trim() || updateCustomList.isPending} />
                                    <Button value={<span className="flex items-center gap-2"><TrashIcon className="w-5" /> Delete list</span>} fullWidth={false} onClick={removeList} variant="danger" disabled={deleteCustomList.isPending} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-semibold">{customList.name}</h1>
                                    <Button value={<span className="flex items-center gap-2"><PencilIcon className="w-5" /> Edit</span>} fullWidth={false} onClick={startEditing} />
                                </div>
                            )
                        }
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-foreground-secondary">
                            <span>{mediaItems.length} {mediaItems.length === 1 ? "item" : "items"}</span>
                            <span>•</span>
                            <span>Created {formatDate(customList.created_at, "short")}</span>
                            <span>•</span>
                            <span>Updated {formatDate(customList.updated_at, "short")}</span>
                        </div>
                    </div>
                </div>
                {
                    updateCustomList.error ? (
                        <Error message={updateCustomList.error.message} />
                    ) : null
                }
                {
                    deleteCustomList.error ? (
                        <Error message={deleteCustomList.error.message} />
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
                                {otherLists.size > 0 ? (
                                    <Dropdown title="Add to list" values={otherLists} onSelect={addSelectedToList} />
                                ) : null}
                                {tagOptions.size > 0 ? (
                                    <Dropdown title="Add to tag" values={tagOptions} onSelect={addSelectedToTag} />
                                ) : null}
                                <Button value="Remove selected" fullWidth={false} variant="danger" onClick={removeSelectedFromList} />
                            </>
                        ) : null}
                    </div>
                ) : null}
                {addCustomListItem.error ? <Error message={addCustomListItem.error.message} /> : null}
                {tagMediaItem.error ? <Error message={tagMediaItem.error.message} /> : null}
            </div >
            {
                mediaItems.length <= 0 ? (
                    <p>No items in list</p>
                ) : (
                    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(9rem,2fr))] justify-items-center">
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
            {isDeleteConfirmationOpen ? (
                <Popup onClose={() => setIsDeleteConfirmationOpen(false)} value={
                    <div className="flex flex-col gap-4">
                        {deleteCustomList.isPending ? <Loading /> : null}
                        <h2 className="text-2xl font-semibold">Delete list?</h2>
                        <p>Are you sure you want to delete &quot;{customList.name}&quot;?</p>
                        {deleteCustomList.error ? <Error message={deleteCustomList.error.message} /> : null}
                        <div className="flex justify-end gap-2">
                            <Button value="Cancel" fullWidth={false} onClick={() => setIsDeleteConfirmationOpen(false)} disabled={deleteCustomList.isPending} />
                            <Button value="Delete list" fullWidth={false} variant="danger" onClick={confirmRemoveList} disabled={deleteCustomList.isPending} />
                        </div>
                    </div>
                } />
            ) : null}
            {isBulkRemovalConfirmationOpen ? (
                <Popup onClose={deleteCustomListItem.isPending ? undefined : () => setIsBulkRemovalConfirmationOpen(false)} value={
                    <div className="flex flex-col gap-4">
                        {deleteCustomListItem.isPending ? <Loading /> : null}
                        <h2 className="text-2xl font-semibold">Remove selected items?</h2>
                        <p>Remove {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} from &quot;{customList.name}&quot;?</p>
                        {deleteCustomListItem.error ? <Error message={deleteCustomListItem.error.message} /> : null}
                        <div className="flex justify-end gap-2">
                            <Button value="Cancel" fullWidth={false} onClick={() => setIsBulkRemovalConfirmationOpen(false)} disabled={deleteCustomListItem.isPending} />
                            <Button value="Remove" fullWidth={false} variant="danger" onClick={confirmRemoveSelectedFromList} disabled={deleteCustomListItem.isPending} />
                        </div>
                    </div>
                } />
            ) : null}
        </>

    );
}
