import { useNavigate } from "react-router";
import type { CustomList } from "../../api/customLists/models";
import type { MouseEvent } from "react";

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w300";

interface CustomListCardProps {
    customList: CustomList;
}

export function CustomListCard({ customList }: CustomListCardProps) {
    const navigate = useNavigate();

    const listName = customList.name.length > 30 ? `${customList.name.substring(0, 30)}...` : customList.name;

    const onPosterClick = (e: MouseEvent) => {
        e.preventDefault();
        navigate(`/custom-lists/${customList.id}`);
    };

    return (
        <div className="relative w-full min-w-72 max-w-md overflow-hidden rounded-md border border-background-tertiary bg-background-primary shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
            {/* Poster previews */}
            <div className="relative h-44 cursor-pointer overflow-hidden border-b border-background-tertiary">
                <a className="block h-full w-full" href={`/custom-lists/${customList.id}`} onClick={onPosterClick}>
                    {customList.preview_posters.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <img className="h-20 object-cover grayscale opacity-30" src="/sad_logo.png" alt={customList.name} />
                        </div>
                    ) : (
                        <div className="flex h-full w-full gap-0.5">
                            {customList.preview_posters.slice(0, 4).map((poster, index) => (
                                <img
                                    key={`${poster}-${index}`}
                                    className="min-w-0 flex-1 object-cover"
                                    src={`${TMDB_BASE_URL}/${poster}`}
                                    alt={`${customList.name} poster ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </a>
            </div>

            {/* Info */}
            <div className="flex flex-col text-center gap-2 p-2 wrap-anywhere">
                <span title={customList.name}>{listName}</span>
            </div>
        </div>
    );
}
