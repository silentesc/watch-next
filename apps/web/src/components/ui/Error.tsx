import { AlertCircleIcon } from "./icons/Icons";

export interface ErrorProps {
    message: string;
}

export function Error({ message }: ErrorProps) {
    return (
        <>
            <div className="bg-error p-4 flex">
                <AlertCircleIcon width="24" height="24" className="text-white" />

                <span className="text-lg font-medium mx-4">{message}</span>
            </div>
        </>
    )
}
