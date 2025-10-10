import Link from "next/link"

interface BtnSessionProps {
    children: React.ReactNode;
    href?: string;
}

export function BtnSession({children, href='/'}: BtnSessionProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row bg-orange-500 rounded-md p-1">
            <Link
                href={href}
                className="text-white"
            >
                {children}
            </Link>
        </div>
    )
}