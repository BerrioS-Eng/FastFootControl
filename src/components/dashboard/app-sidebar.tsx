"use client"
import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./navMain"
import { NavUser } from "./navUser"
import type { UserLoginResponse } from "@/lib/auth/types"
import type { Role } from "@/lib/auth/types"
import {filterNavItemsByRole, navMain} from "@/components/dashboard/nav-config";
import {IconInnerShadowTop} from "@tabler/icons-react";
import Link from "next/link";

export function AppSidebar(
    { user, ...props }: React.ComponentProps<typeof Sidebar> & { user: UserLoginResponse | null },
) {
    const role: Role | undefined = user?.role
    const items = filterNavItemsByRole(navMain, role)

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button:!p-1.5">
                            <Link href="/">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Delichicharrones</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}