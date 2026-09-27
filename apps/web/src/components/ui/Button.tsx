interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
    value: string | React.ReactElement;
    type?: "button" | "submit" | "reset";
    alignment?: "left" | "center" | "right";
    fullWidth?: boolean;
    variant?: "default" | "primary" | "danger";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button({ value, type = "button", alignment = "center", fullWidth = true, variant = "default", onClick = () => { }, ...props }: ButtonProps) {
    let variantClassName = "";
    switch (variant) {
        case "default":
            variantClassName = "border-background-tertiary bg-background-secondary hover:bg-background-tertiary";
            break;
        case "primary":
            variantClassName = "border-primary bg-primary hover:bg-primary/80";
            break;
        case "danger":
            variantClassName = "border-error/80 text-error bg-background-secondary hover:bg-error/15";
            break;
    }
    return (
        <>
            <button
                onClick={onClick}
                type={type}
                className={
                    `${fullWidth ? "w-full" : "w-auto shrink-0"} border-2 p-2 outline-none hover:cursor-pointer
                    ${variantClassName}
                    ${alignment === "left" && "text-left"}
                    ${alignment === "center" && "text-center"}
                    ${alignment === "right" && "text-right"}`
                }
                {...props}
            >
                {value}
            </button>
        </>
    )
}
