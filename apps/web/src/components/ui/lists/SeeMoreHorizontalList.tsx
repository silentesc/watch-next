import { Fragment, type MouseEvent, type ReactNode } from "react";
import { ArrowCircleRightIcon } from "../icons/Icons";

interface SeeMoreHorizontalListProps<T> {
    items: Array<T>;
    seeMoreLinkHint: string;
    onSeeMoreClick: () => void;
    getKey: (item: T) => React.Key;
    renderItem: (item: T) => ReactNode;
}

export function SeeMoreHorizontalList<T>({ items, seeMoreLinkHint, onSeeMoreClick, getKey, renderItem }: SeeMoreHorizontalListProps<T>) {
    const shownItems = items.slice(0, -1);
    const lastItem = items.at(-1);
    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        onSeeMoreClick();
    };

    return <div className="flex gap-2 overflow-scroll">
        {shownItems.map(item => <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>)}
        {lastItem ? <div className="relative">
            <div className="blur-sm pointer-events-none">{renderItem(lastItem)}</div>
            <a href={seeMoreLinkHint} onClick={onClick}>
                <div className="absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer flex flex-col gap-1 items-center">
                    <span className="font-semibold text-nowrap">See more</span>
                    <ArrowCircleRightIcon className="w-7" />
                </div>
            </a>
        </div> : null}
    </div>;
}
