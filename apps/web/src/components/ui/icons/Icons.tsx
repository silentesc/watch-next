import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

interface BaseIconProps extends IconProps {
    children: ReactNode;
}

function BaseIcon({ children, viewBox = "0 0 24 24", ...props }: BaseIconProps) {
    return <svg viewBox={viewBox} {...props}>{children}</svg>;
}

export function ChevronDownIcon(props: IconProps) {
    return <BaseIcon {...props} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></BaseIcon>;
}

export function MenuIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></BaseIcon>;
}

export function CloseIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></BaseIcon>;
}

export function ChevronLeftIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></BaseIcon>;
}

export function ChevronRightIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></BaseIcon>;
}

export function ArrowCircleRightIcon(props: IconProps) {
    return <BaseIcon {...props} fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" /></BaseIcon>;
}

export function ArrowDownIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v14m0 0l-4-4m4 4l4-4" /></BaseIcon>;
}

export function PencilIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2"><path d="m16.5 3.5 4 4M4 20l3.5-.75L19.5 7.25a2.12 2.12 0 0 0-3-3L4.5 16.25 4 20Z" /></BaseIcon>;
}

export function TrashIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></BaseIcon>;
}

export function AlertCircleIcon(props: IconProps) {
    return <BaseIcon {...props} fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></BaseIcon>;
}

export function StarIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 2l2.5 6L21 9l-5 3.5L17 20l-5-3-5 3 1-7.5L3 9l6.5-1L12 2z" /></BaseIcon>;
}

export function FilmIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="18" cy="12" r="1" /></BaseIcon>;
}

export function TvIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M4 8h4M4 12h4M4 16h4M20 8h-4M20 12h-4M20 16h-4" /></BaseIcon>;
}

export function DownloadIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></BaseIcon>;
}

export function BoxIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 3a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21a2 2 0 0 0 2 0l7-3.27A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 11 20.73 6.96" /></BaseIcon>;
}

export function TicketIcon(props: IconProps) {
    return <BaseIcon {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><polyline points="17 2 12 7 7 2" /><line x1="8" y1="21" x2="16" y2="21" /></BaseIcon>;
}
