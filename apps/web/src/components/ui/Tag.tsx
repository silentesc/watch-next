interface TagProps {
    name: string;
    variant?: "default" | "primary" | "danger";
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function Tag({ name, variant = "default", onClick }: TagProps) {
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
            <span className="shrink-0 opacity-50">
                #
            </span>
            <span className="min-w-0 truncate" title={name}>
                {name}
            </span>
        </div>
    );
}
