"use client"

import { type Icon } from "@tabler/icons-react"
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
    const pathname = usePathname();

    // Helper para saber si el item está activo
    // Usamos startsWith para cubrir subrutas (p.ej. /dashboard/products/123)
    const isActive = (url: string) => pathname?.endsWith(url);

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                {/* Ítems dinámicos */}
                <SidebarMenu>
                    {items.map((item) => {
                        const active = isActive(item.url || "");
                        return (
                            <Link href={item.url} key={item.title}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className={
                                            active
                                                ? "bg-[#FB8C00] text-primary-foreground font-bold hover:bg-[#FB8C00] hover:text-primary-foreground active:bg-[#FB8C00] active:text-primary-foreground"
                                                : "text-foreground font-bold hover:bg-primary/10 hover:text-foreground active:bg-primary/20"
                                        }
                                        aria-current={active ? "page" : undefined}
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