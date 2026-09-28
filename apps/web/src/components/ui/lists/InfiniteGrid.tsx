import { type InfiniteData, type UseInfiniteQueryResult } from "@tanstack/react-query";
import { Fragment, type ReactNode, useEffect, useRef } from "react";
import { Error } from "../Error";
import { Loading } from "../Loading";

export interface InfinitePage<T> {
    results: Array<T>;
}

interface InfiniteGridProps<T> {
    infiniteQuery: UseInfiniteQueryResult<InfiniteData<InfinitePage<T>, unknown>, globalThis.Error>;
    getKey: (item: T) => React.Key;
    renderItem: (item: T) => ReactNode;
}

export function InfiniteGrid<T>({ infiniteQuery, getKey, renderItem }: InfiniteGridProps<T>) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const items = [...new Map(infiniteQuery.data?.pages.flatMap(page => page.results).map(item => [getKey(item), item]) ?? []).values()];

    useEffect(() => {
        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) infiniteQuery.fetchNextPage();
        }, { rootMargin: "400px" });
        if (bottomRef.current) observerRef.current.observe(bottomRef.current);
        return () => observerRef.current?.disconnect();
    }, [infiniteQuery.fetchNextPage, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage]);

    if (infiniteQuery.error) return <Error message={infiniteQuery.error.message} />;

    return <>
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(9rem,2fr))] justify-items-center">
            {items.map(item => <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>)}
        </div>
        <div ref={bottomRef} className="h-10 w-full">{(infiniteQuery.isLoading || infiniteQuery.isFetchingNextPage) ? <Loading /> : null}</div>
    </>;
}
