interface LoadingProps {
    size?: "small" | "medium" | "large";
}

export function Loading({ size = "large" }: LoadingProps) {
    let circle = <></>;
    switch (size) {
        case "small":
            circle = <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-l-primary"></div>;
            break;
        case "medium":
            circle = <div className="h-10 w-10 animate-spin rounded-full border-3 border-black/40 border-l-primary"></div>;
            break;
        case "large":
            circle = <div className="h-14 w-14 m-4 animate-spin rounded-full border-4 border-black/40 border-l-primary"></div>;
            break;
    }

    return (
        <div className="flex justify-center items-center">
            {circle}
        </div>
    );
}
