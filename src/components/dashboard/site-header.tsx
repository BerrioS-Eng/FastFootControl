"use client"

import {useMemo} from "react"
import {usePathname} from "next/navigation"
import {SidebarTrigger} from "../ui/sidebar"
import {navMain, getCurrentModuleTitle} from "./nav-config"


export function SiteHeader() {
    const pathname = usePathname()

    const currentModuleTitle = useMemo(
        () => getCurrentModuleTitle(pathname, navMain),
        [pathname],
    )

    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="ml-1"/>

                {/* Módulo actual */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                        {currentModuleTitle}
                    </span>
                </div>


            </div>
        </header>
    )
}