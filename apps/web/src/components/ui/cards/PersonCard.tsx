import type { PersonOverview } from "../../../api/tmdb/models";
import { PosterCard } from "./PosterCard";

interface PersonCardProps {
    person: PersonOverview;
}

export function PersonCard({ person }: PersonCardProps) {
    return <PosterCard title={person.name} posterPath={person.profile_path} label="PERSON" labelClassName="bg-orange-600/80" />;
}
