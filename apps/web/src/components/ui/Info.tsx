import { AlertCircleIcon } from "./icons/Icons";

interface InfoProps {
    message: string;
}

export function Info({ message }: InfoProps) {
    return (
        <>
            <div className="bg-success p-4 flex">
                <AlertCircleIcon width="24" height="24" className="text-white" />

                <span className="text-lg font-medium mx-4">{message}</span>
            </div>
        </>
    )
}
