import { useMemo, useState } from "react";
import { Error } from "../../components/ui/Error";
import { Loading } from "../../components/ui/Loading";
import { MultiSelectDropdown } from "../../components/ui/MultiSelectDropdown";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useTags } from "../../hooks/tags/use_tags";
import { TextArea } from "../../components/ui/TextArea";
import { Button } from "../../components/ui/Button";
import { useSearchMulti } from "../../hooks/tmdb/use_search_multi";
import type { MultiSearchResult } from "../../api/tmdb/models";
import { MovieCard } from "../../components/ui/cards/MovieCard";
import { TvSeriesCard } from "../../components/ui/cards/TvSeriesCard";
import { CollectionCard } from "../../components/ui/cards/CollectionCard";
import { useAddCustomListItem } from "../../hooks/customLists/use_add_custom_list_item";
import { useTagMediaItem } from "../../hooks/tags/use_tag_media_item";

const isAlreadyAddedError = (error: unknown) =>
    error instanceof globalThis.Error && [
        "Media item already has this tag.",
        "Media item is already in custom list.",
    ].includes(error.message);

interface SearchItemProps {
    searchText: string;
    onSelect: (mediaType: "tv" | "movie" | "collection", id: number) => Promise<boolean>;
    onAdded: () => void;
}

const renderItem = (multi_search_result: MultiSearchResult) => {
    switch (multi_search_result.media_type) {
        case "movie":
            return <MovieCard movie={multi_search_result} navigable={false} />;
        case "tv":
            return <TvSeriesCard tvSeries={multi_search_result} navigable={false} />;
        case "collection":
            return <CollectionCard collection={multi_search_result} navigable={false} />;
    }
};

function SearchItem({ searchText, onSelect, onAdded }: SearchItemProps) {
    const searchMulti = useSearchMulti("multi", searchText);
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

    if (searchMulti.isLoading) return <Loading />;
    if (searchMulti.error) return <Error message={searchMulti.error.message} />;
    if (!searchMulti.data) return <Error message={`No data returned for ${searchText}`} />;

    const searchResults = searchMulti.data.pages[0].results.filter(r => r.media_type !== "person");

    return (
        <div>
            <h2 className="text-2xl my-2 font-medium">{searchText}</h2>
            <div className="flex gap-2 overflow-scroll">
                {searchResults.map(r => (
                    <div key={r.id} className="flex flex-col gap-1 [&>div:first-child]:flex-1">
                        {renderItem(r)}
                        <Button
                            value={addedItems.has(`${r.media_type}-${r.id}`) ? "Added" : "Add"}
                            variant={addedItems.has(`${r.media_type}-${r.id}`) ? "primary" : "default"}
                            disabled={addedItems.has(`${r.media_type}-${r.id}`)}
                            onClick={async () => {
                                if (r.id !== undefined && await onSelect(r.media_type, r.id)) {
                                    setAddedItems(current => new Set(current).add(`${r.media_type}-${r.id}`));
                                    onAdded();
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ImportPage() {
    const customListsQuery = useCustomLists();
    const tagsQuery = useTags();

    const [selectedListKeys, setSelectedListKeys] = useState<Set<string>>(new Set());
    const listValues: Map<string, string> = useMemo(() => new Map(customListsQuery.data?.map(l => [String(l.id), l.name]) || []), [customListsQuery.data]);

    const [selectedTagKeys, setSelectedTagKeys] = useState<Set<string>>(new Set());
    const tagValues: Map<string, string> = useMemo(() => new Map(tagsQuery.data?.map(l => [String(l.id), l.name]) || []), [tagsQuery.data]);

    const [input, setInput] = useState("");

    const addCustomListItem = useAddCustomListItem();
    const tagMediaItem = useTagMediaItem();
    const [searchItems, setSearchItems] = useState<string[]>([]);
    const [pendingSearchItems, setPendingSearchItems] = useState<Set<string>>(new Set());
    const [selectionError, setSelectionError] = useState<string>();

    const onSearchSelect = async (mediaType: "tv" | "movie" | "collection", id: number) => {
        setSelectionError(undefined);
        const item = {
            kind: mediaType === "tv" ? "tv_series" : mediaType,
            external_source: "tmdb",
            external_id: id,
        };
        const additions = [
            ...Array.from(selectedListKeys, key => addCustomListItem.mutateAsync({ listId: Number(key), item })),
            ...Array.from(selectedTagKeys, key => tagMediaItem.mutateAsync({ tagId: Number(key), item })),
        ];

        if (additions.length === 0) return false;

        try {
            await Promise.all(additions.map(addition => addition.catch(error => {
                if (!isAlreadyAddedError(error)) throw error;
            })));
            return true;
        } catch (error) {
            setSelectionError(error instanceof globalThis.Error ? error.message : "Unable to add media item.");
            return false;
        }
    };

    const search = () => {
        const searchTexts = Array.from(new Set(input.split("\n")));
        const items = searchTexts.filter(s => s.length > 0);
        setSearchItems(items);
        setPendingSearchItems(new Set(items));
    };

    const visiblePendingSearches = new Set(Array.from(pendingSearchItems).slice(0, 5));

    return (
        <div>
            <h1 className="text-3xl">Import</h1>

            {/* List / Tag selection */}
            <div className="my-5 flex flex-wrap gap-2">
                {customListsQuery.isPending ? <Loading /> : customListsQuery.isError ? <Error message={customListsQuery.error.message} /> : (
                    <MultiSelectDropdown
                        placeholder="Lists"
                        selectedKeys={selectedListKeys}
                        values={listValues}
                        onSelect={key => setSelectedListKeys(current => new Set(current).add(key))}
                        onDeselect={key => setSelectedListKeys(current => {
                            const next = new Set(current);
                            next.delete(key);
                            return next;
                        })}
                    />
                )}
                {tagsQuery.isPending ? <Loading /> : tagsQuery.isError ? <Error message={tagsQuery.error.message} /> : (
                    <MultiSelectDropdown
                        placeholder="Tags"
                        selectedKeys={selectedTagKeys}
                        values={tagValues}
                        onSelect={key => setSelectedTagKeys(current => new Set(current).add(key))}
                        onDeselect={key => setSelectedTagKeys(current => {
                            const next = new Set(current);
                            next.delete(key);
                            return next;
                        })}
                    />
                )}
            </div>

            {/* Input */}
            <div className="flex flex-col gap-1">
                <TextArea placeholder={"Cool movie\nCool Show\n..."} value={input} rows={5} onChange={e => setInput(e.target.value)} spellCheck={false} />
                <div className="w-40">
                    <Button value={"Search"} onClick={() => search()} />
                </div>
            </div>

            {selectionError ? <Error message={selectionError} /> : null}
            {searchItems.filter(searchText => !pendingSearchItems.has(searchText) || visiblePendingSearches.has(searchText)).map(searchText => (
                <SearchItem
                    key={searchText}
                    searchText={searchText}
                    onSelect={onSearchSelect}
                    onAdded={() => setPendingSearchItems(current => {
                        const next = new Set(current);
                        next.delete(searchText);
                        return next;
                    })}
                />
            ))}
        </div>
    );
}
