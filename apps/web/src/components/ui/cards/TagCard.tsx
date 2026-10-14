import { Link } from "@tanstack/react-router";
import type { Tag as TagModel } from "../../../api/tags/models";
import { Tag } from "../Tag";

interface TagCardProps {
    tag: TagModel;
}

export function TagCard({ tag }: TagCardProps) {
    return (
        <Link to="/tags/$id" params={{ id: String(tag.id) }}>
            <Tag name={tag.name} />
        </Link>
    );
}
