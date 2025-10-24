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

export function NavMain({
    items,
}: {
    items: {
        title: string,
        url: string,
        icon?: Icon
    }[]
}) {
    
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <Link href="/dashboard/sales" key="sales">
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            tooltip="Registrar ventas"
                            className="bg-[#FB8C00] text-primary-foreground font-bold hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                        >
                            <IconShoppingCart />
                            <span>Ventas</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </Link>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <Link href={item.url} key={item.title}>
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span className="font-bold">{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Link>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}