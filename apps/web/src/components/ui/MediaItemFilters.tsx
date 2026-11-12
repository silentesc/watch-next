import { useState, useEffect } from "react";
import type { MediaItemFiltersSearch } from "../../app/search";
import { Button } from "./Button";
import { CloseIcon } from "./icons/Icons";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { Dropdown } from "./Dropdown";
import { useCustomLists } from "../../hooks/customLists/use_custom_lists";
import { useTags } from "../../hooks/tags/use_tags";

const mediaTypeValues = new Map([
    ["all", "All"],
    ["collection", "Collection"],
    ["movie", "Movie"],
    ["tv", "TV Series"],
])

interface FiltersProps {
    isOpen: boolean,
    filters: MediaItemFiltersSearch;
    onFiltersChange: (filters: MediaItemFiltersSearch) => void;
    onClose: () => void;
}

export function MediaItemFilters({ isOpen, filters, onFiltersChange, onClose }: FiltersProps) {
    const [mediaType, setMediaType] = useState<string>(filters.mediaType || "all");
    const [listIds, setListIds] = useState<Array<string>>(filters.listIds?.split(/[|,]/) || []);
    const [listIdsOr, setListIdsOr] = useState(filters.listIds?.includes("|") || false);
    const [tagIds, setTagIds] = useState<Array<string>>(filters.tagIds?.split(/[|,]/) || []);
    const [tagIdsOr, setTagIdsOr] = useState(filters.tagIds?.includes("|") || false);

    const listQuery = useCustomLists();
    const listValues = new Map([...(listQuery.data?.map(list => [String(list.id), list.name] as const) ?? [])]);

    const tagQuery = useTags();
    const tagValues = new Map([...(tagQuery.data?.map(tag => [String(tag.id), tag.name] as const) ?? [])]);

    useEffect(() => {
        if (!isOpen) return;
        setMediaType(filters.mediaType || "all");
        setListIds(filters.listIds?.split(/[|,]/).filter(Boolean) || []);
        setListIdsOr(filters.listIds?.includes("|") || false);
        setTagIds(filters.tagIds?.split(/[|,]/).filter(Boolean) || []);
        setTagIdsOr(filters.tagIds?.includes("|") || false);
    }, [filters.listIds, filters.mediaType, filters.tagIds, isOpen]);

    const resetFilters = () => {
        setMediaType("all");
        setListIds([]);
        setListIdsOr(false);
        setTagIds([]);
        setTagIdsOr(false);
    }

    const applyFilters = () => {
        const filters: MediaItemFiltersSearch = {
            mediaType,
            listIds: listIds.join(listIdsOr ? "|" : ",") || undefined,
            tagIds: tagIds.join(tagIdsOr ? "|" : ",") || undefined,
        };

        onFiltersChange(filters);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 flex justify-end z-1000 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

            <div onClick={() => onClose()} className="absolute w-full h-full bg-background-secondary/50">
            </div>

            {/* Filters */}
            <div className={`m-2 p-5 min-w-70 max-w-115 bg-background-primary flex flex-col gap-6 overflow-scroll transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex">
                    <div className="m-auto">
                    </div>
                    {/* x button */}
                    <CloseIcon onClick={() => onClose()} className="w-6 h-6 cursor-pointer" />
                </div>
                <div className="flex gap-1">
                    <Button value="Apply Filters" onClick={applyFilters} />
                    <Button value="Reset Filters" onClick={resetFilters} />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-medium">Media Type</span>
                    <Dropdown title={mediaTypeValues.get(mediaType) || mediaType} values={mediaTypeValues} onSelect={(value) => setMediaType(value)} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-medium">Lists</span>
                        <Button value={listIdsOr ? "OR" : "AND"} fullWidth={false} onClick={() => setListIdsOr(prev => !prev)} />
                    </div>
                    <MultiSelectDropdown
                        placeholder="Lists"
                        selectedKeys={new Set(listIds)}
                        values={listValues}
                        onSelect={(key: string) => setListIds(prev => [...prev, key])}
                        onDeselect={(key: string) => setListIds(prev => prev.filter(k => k !== key))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-medium">Tags</span>
                        <Button value={tagIdsOr ? "OR" : "AND"} fullWidth={false} onClick={() => setTagIdsOr(prev => !prev)} />
                    </div>
                    <MultiSelectDropdown
                        placeholder="Tags"
                        selectedKeys={new Set(tagIds)}
                        values={tagValues}
                        onSelect={(key: string) => setTagIds(prev => [...prev, key])}
                        onDeselect={(key: string) => setTagIds(prev => prev.filter(k => k !== key))}
                    />
                </div>
            </div>
        </div>
    );
}
