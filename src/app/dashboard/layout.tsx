import React from 'react'
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "280px",
                        "--sidebar-width-mobile": "calc(100vw - 2rem)",
                        "--header-height": "3.5rem",
                    } as React.CSSProperties
                }
                defaultOpen={false} // Better mobile experience
            >
                <AppSidebar variant='inset' />
                <SidebarInset className="flex flex-col min-h-screen">
                    <SiteHeader />
                    <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-x-auto">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedRoute>
    )
}