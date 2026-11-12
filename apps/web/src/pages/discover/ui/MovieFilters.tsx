import { useState, useEffect, useMemo } from "react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { CloseIcon } from "../../../components/ui/icons/Icons";
import { DatePicker } from "../../../components/ui/DatePicker";
import { useLanguages } from "../../../hooks/tmdb/use_languages";
import { useGenreMovie } from "../../../hooks/tmdb/use_genre_movie";
import { MultiSelectDropdown } from "../../../components/ui/MultiSelectDropdown";
import { Dropdown } from "../../../components/ui/Dropdown";
import { useSearchKeyword } from "../../../hooks/tmdb/use_search_keyword";
import { useKeywordDetailsList } from "../../../hooks/tmdb/use_keyword_details";
import { Loading } from "../../../components/ui/Loading";
import { Error } from "../../../components/ui/Error";

export interface MovieFilters {
    releaseDateFrom: Date | undefined,
    releaseDateTo: Date | undefined,
    runtimeFrom: number | undefined,
    runtimeTo: number | undefined,
    tmdbRatingFrom: number | undefined,
    tmdbRatingTo: number | undefined,
    tmdbVoteCountFrom: number | undefined,
    tmdbVoteCountTo: number | undefined,
    withGenres: string | undefined,
    withoutGenres: string | undefined,
    withKeywords: string | undefined,
    originalLanguage: string | undefined,
}

interface FiltersProps {
    isOpen: boolean,
    filters: MovieFilters;
    onFiltersChange: (filters: MovieFilters) => void;
    onClose: () => void;
}

const isFiltersValid = (filters: MovieFilters): boolean => {
    if (filters.releaseDateFrom && filters.releaseDateTo && filters.releaseDateFrom > filters.releaseDateTo) return false;
    if (filters.runtimeFrom !== undefined && filters.runtimeTo !== undefined && filters.runtimeFrom > filters.runtimeTo) return false;
    if (filters.tmdbRatingFrom !== undefined && filters.tmdbRatingTo !== undefined && filters.tmdbRatingFrom > filters.tmdbRatingTo) return false;
    if (filters.tmdbVoteCountFrom !== undefined && filters.tmdbVoteCountTo !== undefined && filters.tmdbVoteCountFrom > filters.tmdbVoteCountTo) return false;
    return true;
};

export function MovieFilters({ isOpen, filters, onFiltersChange, onClose }: FiltersProps) {
    const [releaseDateFrom, setReleaseDateFrom] = useState<Date | undefined>(filters.releaseDateFrom);
    const [releaseDateTo, setReleaseDateTo] = useState<Date | undefined>(filters.releaseDateTo);
    const [runtimeFrom, setRuntimeFrom] = useState<number | undefined>(filters.runtimeFrom);
    const [runtimeTo, setRuntimeTo] = useState<number | undefined>(filters.runtimeTo);
    const [tmdbRatingFrom, setTmdbRatingFrom] = useState<number | undefined>(filters.tmdbRatingFrom);
    const [tmdbRatingTo, setTmdbRatingTo] = useState<number | undefined>(filters.tmdbRatingTo);
    const [tmdbVoteCountFrom, setTmdbVoteCountFrom] = useState<number | undefined>(filters.tmdbVoteCountFrom);
    const [tmdbVoteCountTo, setTmdbVoteCountTo] = useState<number | undefined>(filters.tmdbVoteCountTo);
    const [withGenres, setWithGenres] = useState<Array<string>>(filters.withGenres?.split(/[|,]/) || []);
    const [withGenresOr, setWithGenresOr] = useState(filters.withGenres?.includes("|") || false);
    const [withoutGenres, setWithoutGenres] = useState<Array<string>>(filters.withoutGenres?.split(/[|,]/) || []);
    const [withoutGenresOr, setWithoutGenresOr] = useState(filters.withoutGenres?.includes("|") || false);
    const [withKeywords, setWithKeywords] = useState<Array<string>>(filters.withKeywords?.split(/[|,]/) || []);
    const [withKeywordsOr, setWithKeywordsOr] = useState(filters.withKeywords?.includes("|") || false);
    const [keywordQuery, setKeywordQuery] = useState("");
    const [debouncedKeywordQuery, setDebouncedKeywordQuery] = useState("");
    const [originalLanguage, setOriginalLanguage] = useState<string>(filters.originalLanguage || "*");

    const languages = useLanguages();
    const languagesValues: Map<string, string> = new Map([
        ["*", "All Languages"] as const,
        ...(languages.data?.sort((a, b) => {
            if (a.english_name === b.english_name) return 0;
            if (a.english_name > b.english_name) return 1;
            return -1;
        }).map(language => [language.iso_639_1, language.english_name] as const) ?? [])
    ]);

    const genres = useGenreMovie();
    const genresValues: Map<string, string> = useMemo(() => {
        return new Map(genres.data?.genres.map(genre => [genre.id.toString(), genre.name]));
    }, [genres.data]);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedKeywordQuery(keywordQuery), 250);
        return () => clearTimeout(timeout);
    }, [keywordQuery]);

    const keywordSearch = useSearchKeyword("keywords", debouncedKeywordQuery.trim());
    const keywordDetails = useKeywordDetailsList(withKeywords.map(Number));
    const keywordValues: Map<string, string> = useMemo(() => {
        const values = new Map<string, string>();
        for (const keyword of keywordSearch.data?.pages.flatMap(page => page.results) ?? []) {
            if (keyword.id !== undefined && keyword.name) {
                values.set(keyword.id.toString(), keyword.name);
            }
        }
        keywordDetails.forEach((detail, index) => {
            if (detail.data?.name) values.set(withKeywords[index], detail.data.name);
        });
        return values;
    }, [keywordSearch.data, keywordDetails, withKeywords]);
    const keywordDetailsError = keywordDetails.find(detail => detail.isError)?.error;

    const resetFilters = () => {
        setReleaseDateFrom(undefined);
        setReleaseDateTo(undefined);
        setRuntimeFrom(undefined);
        setRuntimeTo(undefined);
        setTmdbRatingFrom(undefined);
        setTmdbRatingTo(undefined);
        setTmdbVoteCountFrom(undefined);
        setTmdbVoteCountTo(undefined);
        setWithGenres([]);
        setWithoutGenres([]);
        setWithKeywords([]);
        setWithKeywordsOr(false);
        setKeywordQuery("");
        setWithGenresOr(false);
        setWithoutGenresOr(false);
        setOriginalLanguage("*");
    }

    const applyFilters = () => {
        const filters: MovieFilters = {
            releaseDateFrom,
            releaseDateTo,
            runtimeFrom,
            runtimeTo,
            tmdbRatingFrom,
            tmdbRatingTo,
            tmdbVoteCountFrom,
            tmdbVoteCountTo,
            withGenres: withGenres.join(withGenresOr ? "|" : ",") || undefined,
            withoutGenres: withoutGenres.join(withoutGenresOr ? "|" : ",") || undefined,
            withKeywords: withKeywords.join(withKeywordsOr ? "|" : ",") || undefined,
            originalLanguage,
        };

        if (!isFiltersValid(filters)) {
            return;
        }

        if (filters.originalLanguage === "*") filters.originalLanguage = undefined;

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
            <div className={`m-2 p-5 max-w-115 bg-background-primary flex flex-col gap-6 overflow-scroll transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                    <span className="text-2xl font-medium">Release Date</span>
                    <div className="relative flex gap-1">
                        <div className="flex flex-col w-full">
                            From
                            <DatePicker value={releaseDateFrom} placeholder="YYYY-MM-DD" onChange={date => setReleaseDateFrom(date || undefined)} handleRelative={false} topClassName="top-18" />
                        </div>
                        <div className="flex flex-col w-full">
                            To
                            <DatePicker value={releaseDateTo} placeholder="YYYY-MM-DD" onChange={date => setReleaseDateTo(date || undefined)} alignedRight handleRelative={false} topClassName="top-18" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-medium">Runtime</span>
                    <div className="flex gap-1">
                        <div className="flex flex-col">
                            From
                            <Input type="number" placeholder="45" value={runtimeFrom} onChange={e => setRuntimeFrom(e.target.valueAsNumber || undefined)} />
                        </div>
                        <div className="flex flex-col">
                            To
                            <Input type="number" placeholder="180" value={runtimeTo} onChange={e => setRuntimeTo(e.target.valueAsNumber || undefined)} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-medium">TMDB Rating</span>
                    <div className="flex gap-1">
                        <div className="flex flex-col">
                            From
                            <Input type="number" placeholder="6.5" value={tmdbRatingFrom} onChange={e => setTmdbRatingFrom(e.target.valueAsNumber || undefined)} />
                        </div>
                        <div className="flex flex-col">
                            To
                            <Input type="number" placeholder="9.5" value={tmdbRatingTo} onChange={e => setTmdbRatingTo(e.target.valueAsNumber || undefined)} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-medium">TMDB Vote Count</span>
                    <div className="flex gap-1">
                        <div className="flex flex-col">
                            From
                            <Input type="number" placeholder="100" value={tmdbVoteCountFrom} onChange={e => setTmdbVoteCountFrom(e.target.valueAsNumber || undefined)} />
                        </div>
                        <div className="flex flex-col">
                            To
                            <Input type="number" placeholder="100000" value={tmdbVoteCountTo} onChange={e => setTmdbVoteCountTo(e.target.valueAsNumber || undefined)} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-medium">With Genres</span>
                        <Button value={withGenresOr ? "OR" : "AND"} fullWidth={false} onClick={() => setWithGenresOr(prev => !prev)} />
                    </div>
                    <MultiSelectDropdown
                        placeholder="Genres"
                        selectedKeys={new Set(withGenres)}
                        values={genresValues}
                        onSelect={(key: string) => setWithGenres(prev => [...prev, key])}
                        onDeselect={(key: string) => setWithGenres(prev => prev.filter(k => k !== key))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-medium">Without Genres</span>
                        <Button value={withoutGenresOr ? "OR" : "AND"} fullWidth={false} onClick={() => setWithoutGenresOr(prev => !prev)} />
                    </div>
                    <MultiSelectDropdown
                        placeholder="Genres"
                        selectedKeys={new Set(withoutGenres)}
                        values={genresValues}
                        onSelect={(key: string) => setWithoutGenres(prev => [...prev, key])}
                        onDeselect={(key: string) => setWithoutGenres(prev => prev.filter(k => k !== key))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-medium">With Keywords</span>
                        <Button value={withKeywordsOr ? "OR" : "AND"} fullWidth={false} onClick={() => setWithKeywordsOr(prev => !prev)} />
                    </div>
                    <Input
                        placeholder="Type to search keywords"
                        value={keywordQuery}
                        onChange={event => setKeywordQuery(event.target.value)}
                    />
                    {keywordQuery.trim() && keywordSearch.isFetching && <Loading size="small" />}
                    {keywordSearch.isError && <Error message={keywordSearch.error.message} />}
                    {keywordDetails.some(detail => detail.isPending) && <Loading size="small" />}
                    {keywordDetailsError && <Error message={keywordDetailsError.message} />}
                    <MultiSelectDropdown
                        placeholder="Keywords"
                        selectedKeys={new Set(withKeywords)}
                        values={keywordValues}
                        closeOnSelect={false}
                        closeOnOutsideClick={false}
                        onSelect={(key: string) => setWithKeywords(prev => [...prev, key])}
                        onDeselect={(key: string) => setWithKeywords(prev => prev.filter(k => k !== key))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-medium">Original Language</span>
                    <Dropdown title={languagesValues.get(originalLanguage) || originalLanguage} values={languagesValues} onSelect={(value) => setOriginalLanguage(value)} />
                </div>
            </div>
        </div>
    );
}
