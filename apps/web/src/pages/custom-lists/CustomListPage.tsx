import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useCustomListItems } from "../../hooks/customLists/use_custom_list_items";
import { Movie } from "../../components/ui/Movie";
import { Collection } from "../../components/ui/Collection";
import { TvSeries } from "../../components/ui/TvSeries";
import { type CollectionOverview, type MovieOverview, type TvSeriesOverview } from "../../api/tmdb/models";
import { formatDate } from "../../shared/dateFormatter";
import { useDeleteCustomList } from "../../hooks/customLists/use_delete_custom_list";
import { useUpdateCustomList } from "../../hooks/customLists/use_update_custom_list";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Popup } from "../../components/ui/Popup";

function PencilIcon() {
    return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="m16.5 3.5 4 4M4 20l3.5-.75L19.5 7.25a2.12 2.12 0 0 0-3-3L4.5 16.25 4 20Z" /></svg>;
}

function TrashIcon() {
    return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
}

export function CustomListPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [name, setName] = useState("");
    const updateCustomList = useUpdateCustomList();
    const deleteCustomList = useDeleteCustomList();

    const listId: number | null = id && !isNaN(Number(id)) ? Number(id) : null;
    const customListsQuery = useCustomLists();
    const customListItemsQuery = useCustomListItems(listId);
    const customList = customListsQuery.data?.find(list => list.id === listId);

    if (!listId) {
        return <Error message="No list id specified" />
    }

    const queryError = customListsQuery.error || customListItemsQuery.error;
    if (queryError) {
        return <Error message={queryError.message} />
    }
    if (customListsQuery.isLoading || customListItemsQuery.isLoading) {
        return <Loading />
    }
    if (!customList || !customListItemsQuery.data) {
        return <Error message="No data returned" />
    }

    const mediaItems = customListItemsQuery.data;

    const startEditing = () => {
        setName(customList.name);
        setIsEditing(true);
    };

    const saveChanges = () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        updateCustomList.mutate({ listId, name: trimmedName }, { onSuccess: () => setIsEditing(false) });
    };

    const removeList = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const confirmRemoveList = () => {
        deleteCustomList.mutate(listId, { onSuccess: () => navigate("/custom-lists") });
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
                                    <Button value={"Save"} type="button" fullWidth={false} variant="primary" onClick={saveChanges} disabled={!name.trim() || updateCustomList.isPending} />
                                    <Button value={"Cancel"} type="button" fullWidth={false} onClick={() => setIsEditing(false)} disabled={!name.trim() || updateCustomList.isPending} />
                                    <Button value={<span className="flex items-center gap-2"><TrashIcon /> Delete list</span>} fullWidth={false} onClick={removeList} variant="danger" disabled={deleteCustomList.isPending} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-semibold">{customList.name}</h1>
                                    <Button value={<span className="flex items-center gap-2"><PencilIcon /> Edit</span>} fullWidth={false} onClick={startEditing} />
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
                    ) : <></>
                }
                {
                    deleteCustomList.error ? (
                        <Error message={deleteCustomList.error.message} />
                    ) : <></>
                }
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
                                    return <Collection key={key} collection={collection} />
                                case "movie":
                                    const movie = {
                                        id: item.external_id, title: item.title, release_date: item.release_date, poster_path: item.poster_path,
                                    } as MovieOverview;
                                    return <Movie key={key} movie={movie} />
                                case "tv_series":
                                    const tvSeries = {
                                        id: item.external_id, name: item.title, first_air_date: item.release_date, poster_path: item.poster_path,
                                    } as TvSeriesOverview;
                                    return <TvSeries key={key} tvSeries={tvSeries} />
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
        </>

    );
}
