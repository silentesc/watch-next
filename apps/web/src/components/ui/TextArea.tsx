export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> {
    placeholder?: string;
    value?: string | number | readonly string[];
    required?: boolean;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => void;
}

export function TextArea({ placeholder = "", value = "", rows = 3, required = false, onChange = () => { }, ...props }: TextAreaProps) {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            rows={rows}
            required={required}
            onChange={onChange}
            className="w-full border-background-tertiary border-2 p-2 outline-none bg-background-secondary"
            {...props}
        />
    )
}
