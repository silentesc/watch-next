import { PosterCard } from "./PosterCard";

export interface PersonCardProps {
    id: number;
    name: string;
    description?: string;
    posterPath?: string;
}

export function PersonCard({ id, name, description, posterPath }: PersonCardProps) {
    return <PosterCard title={name} description={description} posterPath={posterPath} link={{ to: "/person/$id", params: { id: String(id) } }} label="PERSON" labelClassName="bg-orange-600/80" />;
}
