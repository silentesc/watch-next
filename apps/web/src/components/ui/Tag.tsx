interface TagProps {
    name: string;
    variant?: "default" | "primary" | "danger";
    isLoading?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function Tag({ name, variant = "default", isLoading = false, onClick }: TagProps) {
    let variantClassName = "";
    switch (variant) {
        case "default":
            variantClassName = "border-background-tertiary bg-background-primary hover:bg-background-secondary";
            break;
        case "primary":
            variantClassName = "border-primary bg-primary hover:bg-primary/80";
            break;
    }
    return (
        <div
            className={`inline-flex max-w-full items-center gap-2 rounded-full border ${variantClassName} px-4 py-1.5 text-sm shadow-sm cursor-pointer`}
            onClick={onClick}
        >
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-l-primary"></div>
            ) : (
                <span className="shrink-0 opacity-50">
                    #
                </span>
            )}
            <span className="min-w-0 truncate" title={name}>
                {name}
            </span>
        </div>
    );
}
