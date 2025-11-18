import React from 'react'
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { UserSyncComponent } from '@/components/UserSyncComponent'

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "300px",
                            "--sidebar-width-mobile": "280px",
                            "--header-height": "4rem",
                        } as React.CSSProperties
                    }
                    defaultOpen={false} // Mejor experiencia móvil
                >
                    <AppSidebar variant='inset' />
                    <SidebarInset className="flex flex-col min-h-screen">
                        <SiteHeader />
                        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </main>
                        
                        {/* Footer responsive */}
                        <footer className="border-t bg-white/80 backdrop-blur-sm mt-auto">
                            <div className="max-w-7xl mx-auto px-4 py-3">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span>© 2024 FastFoodControl</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                            v2.0
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span>DeliChicharrones</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </SidebarInset>
                    <UserSyncComponent />
                </SidebarProvider>
            </div>
        </ProtectedRoute>
    )
}