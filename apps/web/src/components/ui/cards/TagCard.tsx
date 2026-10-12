import { Link } from "@tanstack/react-router";
import type { Tag } from "../../../api/tags/models";

interface TagCardProps {
    tag: Tag;
}

export function TagCard({ tag }: TagCardProps) {
    return (
        <Link to="/tags/$id" params={{ id: String(tag.id) }}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-background-tertiary bg-background-primary px-4 py-1.5 text-sm shadow-sm"
        >
            <span className="shrink-0 opacity-50">
                #
            </span>
            <span className="min-w-0 truncate" title={tag.name}>
                {tag.name}
            </span>
        </Link>
    );
}
