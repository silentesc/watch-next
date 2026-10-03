import { useNavigate } from "react-router";

interface PosterCardProps {
    title?: string;
    description?: string;
    posterPath?: string;
    href?: string;
    label: string;
    labelClassName: string;
}

export function PosterCard({ title = "", description, posterPath, href, label, labelClassName }: PosterCardProps) {
    const navigate = useNavigate();
    const displayTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title;

    const onPosterClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (href) navigate(href);
    };

    return (
        <div className="relative min-w-35 max-w-45 bg-background-primary shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] border border-background-tertiary rounded-md">
            <div className={`absolute top-1 left-1 px-2 py-1 rounded text-xs font-semibold z-10 ${labelClassName}`}>
                {label}
            </div>
            <div className="aspect-2/3 cursor-pointer">
                <a href={href} onClick={onPosterClick}>
                    {posterPath ? (
                        <img className="rounded-t-md w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w300${posterPath}`} alt={title} />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <img className="rounded-t-md object-cover grayscale opacity-30" src="/logo_sad.png" alt={title} />
                        </div>
                    )}
                </a>
            </div>
            <div className="flex flex-col text-center p-1">
                <span title={displayTitle}>{displayTitle}</span>
                {description ? <span title={description} className="opacity-75">{description}</span> : null}
            </div>
        </div>
    );
}
