import { Searchbar } from "../../components/ui/Searchbar";
import { MovieGrid } from "../../components/ui/lists/MovieGrid";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useSearchMovie } from "../../hooks/tmdb/use_search_movie";
import { CollectionGrid } from "../../components/ui/lists/CollectionGrid";
import { useSearchCollection } from "../../hooks/tmdb/use_search_collection";
import { useSearchTvSeries } from "../../hooks/tmdb/use_search_tv_series";
import { TvSeriesGrid } from "../../components/ui/lists/TvSeriesGrid";
import { useSearchMulti } from "../../hooks/tmdb/use_search_multi";
import { MultiGrid } from "../../components/ui/lists/MultiGrid";

export function SearchPage() {
    const [queryParams, setQueryParams] = useSearchParams();

    const categories = new Map([
        ["multi", "All"],
        ["movies", "Movies"],
        ["tv_series", "TV Series"],
        ["collections", "Collections"],
    ]);

    const category = queryParams.get("category") || Array.from(categories.keys())[0];
    const text = queryParams.get("query") || "";
    let [tmpCategory, setTmpCategory] = useState(category);
    let [tmpText, setTmpText] = useState(text);

    const searchMultiInfiniteQuery = useSearchMulti(category, text);
    const searchMovieInfiniteQuery = useSearchMovie(category, text);
    const searchTvSeriesInfiniteQuery = useSearchTvSeries(category, text);
    const searchCollectionInfiniteQuery = useSearchCollection(category, text);

    const onSearch = () => {
        setQueryParams({ category: tmpCategory, query: tmpText });
    }

    useEffect(() => {
        if (category !== tmpCategory) setTmpCategory(category);
        if (text != tmpText) setTmpText(text);
    }, [category, text]);

    useEffect(() => {
        if (tmpText.length > 0) {
            onSearch();
        }
    }, [tmpCategory]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (tmpCategory !== category || tmpText !== text) {
                onSearch();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [tmpText]);

    const renderContent = () => {
        if (!text) return <span className="text-2xl">Search something...</span>;

        switch (category) {
            case "multi": return <MultiGrid infiniteQuery={searchMultiInfiniteQuery} />;
            case "movies": return <MovieGrid infiniteQuery={searchMovieInfiniteQuery} />;
            case "tv_series": return <TvSeriesGrid infiniteQuery={searchTvSeriesInfiniteQuery} />;
            case "collections": return <CollectionGrid infiniteQuery={searchCollectionInfiniteQuery} />;
            default: return <span className="text-2xl">Category {category} not found</span>;
        }
    };

    return (
        <>
            {/* Search Bar */}
            <div className="mb-5">
                <Searchbar
                    category={tmpCategory}
                    text={tmpText}
                    categories={categories}
                    onSearch={onSearch}
                    onCategoryChange={(category) => setTmpCategory(category)}
                    onTextChange={(text) => setTmpText(text)}
                />
            </div>

            {/* Display category */}
            {renderContent()}
        </>
    );
}
