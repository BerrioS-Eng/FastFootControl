"use client"

import * as React from "react"
import {
    IconChartBar,
    IconDashboard,
    IconInnerShadowTop,
    IconListDetails
} from "@tabler/icons-react"
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

const data = {
    user: {
        name: "Local1",
        email: "delichicharronespr@gmail.com",
        avatar: "/logo.png"
    },
    navMain: [
        {
            title: "Panel",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Productos",
            url: "/dashboard/products",
            icon: IconListDetails,
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: IconChartBar,
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button:!p-1.5"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Delichicharrones</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}