import Link from "next/link"

interface BtnSessionProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
}


export function BtnSession({children, href = "/", onClick}: BtnSessionProps) {
    const className =
        "flex flex-wrap items-center gap-2 md:flex-row bg-orange-500 rounded-md px-3 py-2 text-white";

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={className}>
                {children}
            </button>
        );
    }

    return (
        <div className={className}>
            <Link href={href} className="text-white">
                {children}
            </Link>
        </div>
    );
}