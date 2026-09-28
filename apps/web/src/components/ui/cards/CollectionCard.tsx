import type { CollectionOverview } from "../../../api/tmdb/models";
import { PosterCard } from "./PosterCard";

interface CollectionCardProps {
    collection: CollectionOverview;
}

export function CollectionCard({ collection }: CollectionCardProps) {
    return <PosterCard title={collection.name} posterPath={collection.poster_path} href={`/collection/${collection.id}`} label="COLLECTION" labelClassName="bg-green-600/80" />;
}
