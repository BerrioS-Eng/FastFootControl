"use client"

import {
    Icon,
    IconUsers,
    IconDashboard,
    IconListDetails,
    IconReportMoney,
    IconChartBar,
} from "@tabler/icons-react"
import type {Role} from "@/lib/auth/types"

export type NavItem = {
    title: string
    url: string
    icon: Icon
    roles?: Role[]
}

export const navMain: NavItem[] = [
    {title: "Panel", url: "/dashboard", icon: IconDashboard, roles: ["ADMIN", "WORKER"]},
    {title: "Ventas", url: "/dashboard/sales", icon: IconChartBar, roles: ["ADMIN", "WORKER"]},
    {title: "Productos", url: "/dashboard/products", icon: IconListDetails, roles: ["ADMIN"]},
    {title: "Gastos", url: "/dashboard/expenses", icon: IconReportMoney, roles: ["ADMIN"]},
    {title: "Reportes", url: "/dashboard/reports", icon: IconChartBar, roles: ["ADMIN"]},
    {title: "Usuarios", url: "/dashboard/users", icon: IconUsers, roles: ["ADMIN"]},
]

export function filterNavItemsByRole(items: NavItem[], role: Role | undefined) {
    if (!role) return []
    return items.filter((item) => !item.roles || item.roles.includes(role))
}

/**
 * Devuelve el título del módulo actual a partir de la URL.
 * Hace match por prefijo: "/dashboard/expenses/123" → "Gastos".
 */
export function getCurrentModuleTitle(pathname: string, items: NavItem[]): string {
    // Ordenamos por url descendente para que el match más específico gane.
    const sorted = [...items].sort((a, b) => b.url.length - a.url.length)

    const match = sorted.find((item) =>
        pathname === item.url || pathname.startsWith(item.url + "/"),
    )

    return match?.title ?? "Panel"
}
