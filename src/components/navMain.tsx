"use client"

import { IconShoppingCart, type Icon } from "@tabler/icons-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
    items,
}: {
    items: {
        title: string,
        url: string,
        icon?: Icon
    }[]
}) {
    const pathname = usePathname()
    
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <Link href="/dashboard/sales" key="sales">
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            tooltip="Registrar ventas"
                            className={pathname === "/dashboard/sales" 
                                ? "bg-[#FB8C00] text-white font-bold hover:bg-[#F57C00] hover:text-white active:bg-[#F57C00] active:text-white min-w-8 duration-200 ease-linear" 
                                : "bg-gray-100 text-gray-700 font-bold hover:bg-[#FB8C00] hover:text-white active:bg-[#FB8C00] active:text-white min-w-8 duration-200 ease-linear"
                            }
                        >
                            <IconShoppingCart />
                            <span>Ventas</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </Link>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                            <Link href={item.url} key={item.title}>
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        tooltip={item.title}
                                        className={isActive 
                                            ? "bg-[#FB8C00] text-white font-bold hover:bg-[#F57C00] hover:text-white active:bg-[#F57C00] active:text-white" 
                                            : "font-bold hover:bg-gray-100"
                                        }
                                    >
                                        {item.icon && <item.icon />}
                                        <span className="font-bold">{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </Link>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}