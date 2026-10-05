import { Fragment, type ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowCircleRightIcon } from "../icons/Icons";

export type SeeMoreLinkOptions = Omit<LinkProps, "children" | "className">;

interface SeeMoreHorizontalListProps<T> {
    items: Array<T>;
    seeMoreLinkOptions: SeeMoreLinkOptions;
    getKey: (item: T) => React.Key;
    renderItem: (item: T) => ReactNode;
}

export function SeeMoreHorizontalList<T>({ items, seeMoreLinkOptions, getKey, renderItem }: SeeMoreHorizontalListProps<T>) {
    const shownItems = items.slice(0, -1);
    const lastItem = items.at(-1);
    return <div className="flex gap-2 overflow-scroll">
        {shownItems.map(item => <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>)}
        {lastItem ? <div className="relative">
            <div className="blur-sm pointer-events-none">{renderItem(lastItem)}</div>
            <Link {...seeMoreLinkOptions} className="absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer flex flex-col gap-1 items-center">
                <span className="font-semibold text-nowrap">See more</span>
                <ArrowCircleRightIcon className="w-7" />
            </Link>
        </div> : null}
    </div>;
}
