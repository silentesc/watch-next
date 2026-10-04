import { Logo } from "./Logo";

interface LogoTextProps {
    width?: number;
    height?: number;
}

export function LogoText({ width = 64, height = 64 }: LogoTextProps) {
    return (
        <div className="flex items-center gap-3 w-fit">
            <Logo width={width} height={height} />
            <span className="text-xl font-bold">Watch Next</span>
        </div>
    );
}
