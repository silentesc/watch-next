import { Link } from "@tanstack/react-router";

type PosterLink = {
    to: "/collection/$id" | "/movie/$id" | "/person/$id" | "/tv/$id";
    params: { id: string };
};

interface PosterCardProps {
    title?: string;
    description?: string;
    posterPath?: string;
    link?: PosterLink;
    label: string;
    labelClassName: string;
}

export function PosterCard({ title = "", description, posterPath, link, label, labelClassName }: PosterCardProps) {
    const displayTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title;
    const poster = posterPath ? (
        <img className="rounded-t-md w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w300${posterPath}`} alt={title} />
    ) : (
        <div className="h-full flex items-center justify-center">
            <img className="rounded-t-md object-cover grayscale opacity-30" src="/logo_sad.png" alt={title} />
        </div>
    );

    return (
        <div className="relative min-w-35 max-w-45 bg-background-primary shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] border border-background-tertiary rounded-md">
            <div className={`absolute top-1 left-1 px-2 py-1 rounded text-xs font-semibold z-10 ${labelClassName}`}>
                {label}
            </div>
            <div className="aspect-2/3 cursor-pointer">
                {link ? <Link to={link.to} params={link.params}>{poster}</Link> : poster}
            </div>
            <div className="flex flex-col text-center p-1">
                <span title={displayTitle}>{displayTitle}</span>
                {description ? <span title={description} className="opacity-75 whitespace-pre-line">{description}</span> : null}
            </div>
        </div>
    );
}
