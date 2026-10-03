import { PosterCard } from "./PosterCard";

export interface PersonCardProps {
    name: string;
    description?: string;
    posterPath?: string;
}

export function PersonCard({ name, description, posterPath }: PersonCardProps) {
    return <PosterCard title={name} description={description} posterPath={posterPath} label="PERSON" labelClassName="bg-orange-600/80" />;
}
