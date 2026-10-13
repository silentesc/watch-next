export interface CheckboxProps {
    size?: number;
    isSelected: boolean;
    onSelect: () => void;
    onDeselect: () => void;
    ariaLabel?: string;
}

export function Checkbox({ size = 16, isSelected, onSelect, onDeselect, ariaLabel }: CheckboxProps) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-label={ariaLabel ?? (isSelected ? "Deselect" : "Select")}
            onClick={isSelected ? onDeselect : onSelect}
            className="border-0 p-0 bg-none cursor-pointer leading-0"
        >
            <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" className="block">
                <rect
                    x="1"
                    y="1"
                    width="14"
                    height="14"
                    className={isSelected ? "fill-primary stroke-primary stroke-2" : "fill-background-secondary stroke-background-tertiary stroke-2"}
                />
                {isSelected && (
                    <path d="m3 8 3 3 7-7" className="fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round" />
                )}
            </svg>
        </button>
    )
}
