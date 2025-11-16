
import React from 'react';
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SiteHeader } from '@/components/dashboard/site-header';
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";

export default async function DashboardLayout({children}: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant='inset' user={user}/>
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}