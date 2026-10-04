import { useNavigate } from "react-router";

export interface PersonProps {
    id: number;
    name: string;
    description?: string;
    imgPath?: string;
}

function Avatar({ name, src }: { name: string; src?: string }) {
    const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
    return (
        <div className="shrink-0 w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center text-sm font-medium text-foreground-primary overflow-hidden">
            {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
        </div>
    );
}

export function Person({ id, name, description, imgPath }: PersonProps) {
    const navigate = useNavigate();

    return (
        <a href={`/person/${id}`} onClick={e => { e.preventDefault(); navigate(`/person/${id}`); }} className="flex items-center gap-3 p-2 bg-background-primary rounded-md">
            <Avatar name={name} src={imgPath ? `https://image.tmdb.org/t/p/w185${imgPath}` : undefined} />
            <div className="min-w-0">
                <p className="text-sm font-medium text-foreground-primary">{name}</p>
                <span
                    className="block truncate text-xs text-foreground-secondary"
                    title={description || undefined}
                >
                    {description || ""}
                </span>
            </div>
        </a>
    );
}
