import type { ReactNode } from "react";
import { PosterCard } from "./PosterCard";

export interface PersonCardProps {
    id: number;
    name: string;
    description?: string;
    posterPath?: string;
    children?: ReactNode;
}

export function PersonCard({ id, name, description, posterPath, children }: PersonCardProps) {
    return <PosterCard title={name} description={description} posterPath={posterPath} link={{ to: "/person/$id", params: { id: String(id) } }} label="PERSON" labelClassName="bg-orange-600/80">{children}</PosterCard>;
}
