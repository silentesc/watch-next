import type { CollectionOverview } from "../../../api/tmdb/models";
import type { ReactNode } from "react";
import { PosterCard } from "./PosterCard";

interface CollectionCardProps {
    collection: CollectionOverview;
    children?: ReactNode;
    navigable?: boolean;
}

export function CollectionCard({ collection, children, navigable = true }: CollectionCardProps) {
    return <PosterCard title={collection.name} posterPath={collection.poster_path} link={navigable ? { to: "/collection/$id", params: { id: String(collection.id) } } : undefined} label="COLLECTION" labelClassName="bg-green-600/80">{children}</PosterCard>;
}
