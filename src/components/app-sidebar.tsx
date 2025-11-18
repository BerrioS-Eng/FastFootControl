"use client"

import * as React from "react"
import {
    IconChartBar,
    IconDashboard,
    IconInnerShadowTop,
    IconListDetails,
    IconUsers,
    IconSettings
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
import { useAuth } from "@/hooks/useAuth"
import { usePermissions } from "@/hooks/usePermissions"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth()
    const { hasPermission, userRole } = usePermissions()

    // Construir menú dinámico basado en permisos
    const navMainItems = React.useMemo(() => {
        const baseItems = [
            {
                title: "Panel Principal",
                url: "/dashboard",
                icon: IconDashboard,
                show: true
            }
        ]

        // Productos - solo si tiene permisos para verlos
        if (hasPermission('canViewProducts')) {
            baseItems.push({
                title: "Productos",
                url: "/dashboard/products",
                icon: IconListDetails,
                show: true
            })
        }

        // Usuarios - solo si tiene permisos para verlos
        if (hasPermission('canViewUsers')) {
            baseItems.push({
                title: "Usuarios",
                url: "/dashboard/users",
                icon: IconUsers,
                show: true
            })
        }

        // Ventas - siempre disponible
        baseItems.push({
            title: "Ventas",
            url: "/dashboard/sales",
            icon: IconChartBar,
            show: true
        })

        // Reportes - solo para admin y manager
        if (hasPermission('canViewReports')) {
            baseItems.push({
                title: "Reportes",
                url: "/dashboard/analytics",
                icon: IconChartBar,
                show: true
            })
        }

        // Configuración - solo para admin
        if (hasPermission('canManageSettings')) {
            baseItems.push({
                title: "Configuración",
                url: "/config",
                icon: IconSettings,
                show: true
            })
        }

        return baseItems.filter(item => item.show)
    }, [hasPermission])

    const userData = {
        name: user?.fullName || user?.userName || "Usuario",
        email: user?.email || "usuario@fastfoodcontrol.com",
        avatar: "/logo.png",
        role: userRole
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button:!p-1.5"
                        >
                            <a href="/dashboard" className="flex items-center gap-3">
                                <img src="/logo.png" alt="DeliChicharrones" className="!size-6 rounded-full" />
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-gray-800">FastFoodControl</span>
                                    <span className="text-xs text-gray-500 capitalize">Panel {userRole?.toLowerCase()}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    )
}