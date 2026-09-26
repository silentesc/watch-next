interface PopupProps {
    value: React.ReactNode;
    onClose?: () => void;
}

export function Popup({ value, onClose }: PopupProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="relative w-full max-w-md border-2 border-background-tertiary bg-background-primary p-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
                {onClose ? (
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-2xl leading-none text-foreground-secondary hover:cursor-pointer hover:text-foreground"
                        aria-label="Close popup"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                ) : null}
                {value}
            </div>
        </div>
    );
}
