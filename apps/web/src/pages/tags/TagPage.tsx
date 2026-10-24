import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import { useTags } from "../../hooks/tags/use_tags";
import { useTagItems } from "../../hooks/tags/use_tag_items";
import type { MediaItemTree } from "../../api/tags/models";

interface TaggedMediaItem {
    parent: MediaItemTree,
    tagged_children: Array<MediaItemTree>,
}

function groupedMediaItems(mediaItems: Array<MediaItemTree>) {
    const groupedMediaItems: Map<string, TaggedMediaItem> = new Map();
    for (const item of mediaItems) {
        const key = `${item.kind}-${item.external_source}-${item.external_id}`;
        if (["collection", "movie", "tv_series"].includes(item.kind)) {
            const taggedItem = groupedMediaItems.get(key);
            if (!taggedItem) {
                groupedMediaItems.set(key, { parent: item, tagged_children: [] });
            }
            continue;
        }
        else if (["tv_season", "tv_episode"].includes(item.kind)) {
            let parent = item;
            while (parent.parent) {
                parent = parent.parent;
            }
            const parentKey = `${parent.kind}-${parent.external_source}-${parent.external_id}`;
            const taggedItem = groupedMediaItems.get(parentKey) || { parent, tagged_children: [] };
            taggedItem.tagged_children.push(item);
            groupedMediaItems.set(parentKey, taggedItem);
        }
        else {
            console.warn(`Skipping unknown media item kind: ${item.kind}`);
        }
    }
    return Array.from(groupedMediaItems.values());
}

export function TagPage() {
    const { id } = useParams({ from: "/tags/$id" });
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [name, setName] = useState("");
    const updateTag = useUpdateTag();
    const deleteTag = useDeleteTag();

    const tagId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;
    const tagsQuery = useTags();
    const tagItemsQuery = useTagItems(tagId);
    const tag = tagsQuery.data?.find(tag => tag.id === tagId);

    if (!tagId) {
        return <Error message="No tag id specified" />
    }

    const queryError = tagsQuery.error || tagItemsQuery.error;
    if (queryError) {
        return <Error message={queryError.message} />
    }
    if (tagsQuery.isLoading || tagItemsQuery.isLoading) {
        return <Loading />
    }
    if (!tag || !tagItemsQuery.data) {
        return <Error message="No data returned" />
    }

    const mediaItems = tagItemsQuery.data;
    const groupedItems = groupedMediaItems(mediaItems);

    const startEditing = () => {
        setName(tag.name);
        setIsEditing(true);
    };

    const saveChanges = () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        updateTag.mutate({ tagId: tagId, name: trimmedName }, { onSuccess: () => setIsEditing(false) });
    };

    const removeTag = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const confirmRemoveTag = () => {
        deleteTag.mutate(tagId, { onSuccess: () => navigate({ to: "/tags" }) });
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
                                    {updateTag.isPending ? <Loading size="medium" /> : null}
                                    <Button value={"Save"} type="button" fullWidth={false} variant="primary" onClick={saveChanges} disabled={!name.trim() || updateTag.isPending} />
                                    <Button value={"Cancel"} type="button" fullWidth={false} onClick={() => setIsEditing(false)} disabled={!name.trim() || updateTag.isPending} />
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
                            <span>{groupedItems.length} {groupedItems.length === 1 ? "item" : "items"}</span>
                            <span>•</span>
                            <span>{mediaItems.length} total</span>
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
            </div >
            {
                mediaItems.length <= 0 ? (
                    <p>No items with this tag</p>
                ) : (
                    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(9rem,2fr))] justify-items-center">
                        {groupedItems.map(item => {
                            const parent = item.parent;
                            const key = `${parent.kind}${parent.external_source}${parent.external_id}`;
                            switch (parent.kind) {
                                case "collection":
                                    const collection = {
                                        id: parent.external_id, name: parent.title, poster_path: parent.poster_path,
                                    } as CollectionOverview;
                                    return <CollectionCard key={key} collection={collection} />
                                case "movie":
                                    const movie = {
                                        id: parent.external_id, title: parent.title, release_date: parent.release_date, poster_path: parent.poster_path,
                                    } as MovieOverview;
                                    return <MovieCard key={key} movie={movie} />
                                case "tv_series":
                                    const tvSeries = {
                                        id: parent.external_id, name: parent.title, first_air_date: parent.release_date, poster_path: parent.poster_path,
                                    } as TvSeriesOverview;
                                    const seasonCount = item.tagged_children.filter(child => child.kind === "tv_season").length;
                                    const episodeCount = item.tagged_children.filter(child => child.kind === "tv_episode").length;
                                    return (
                                        <TvSeriesCard key={key} tvSeries={tvSeries}>
                                            {item.tagged_children.length > 0 ? (
                                                <div className="absolute inset-x-0 bottom-0 p-2 pt-3 text-sm font-medium bg-linear-to-t from-black/90 via-black/75 to-transparent">
                                                    <p>{seasonCount} tagged {seasonCount === 1 ? "season" : "seasons"}</p>
                                                    <p>{episodeCount} tagged {episodeCount === 1 ? "episode" : "episodes"}</p>
                                                </div>
                                            ) : null}
                                        </TvSeriesCard>
                                    )
                                default:
                                    return <Error key={key} message={`Media item has unknown kind: ${parent.kind}`} />
                            }
                        })}
                    </div>
                )
            }
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
        </>

    );
}
