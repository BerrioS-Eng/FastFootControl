"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { 
    IconDotsVertical, 
    IconLogout, 
    IconUserCircle, 
    IconSettings,
    IconKey,
    IconShieldCheck,
    IconUser,
    IconCrown,
    IconBriefcase
} from "@tabler/icons-react"
import { useAuth } from "@/hooks/useAuth"
import { usePermissions } from "@/hooks/usePermissions"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function NavUser({
    user,
}: {
    user: {
        name: string,
        email: string,
        avatar: string,
        role?: string
    }
}) {
  const { isMobile } = useSidebar();
  const { logout, user: authUser } = useAuth();
  const { isAdmin, isManager, isWorker, userRole } = usePermissions();
  const router = useRouter();    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Generar avatar basado en iniciales
    const generateAvatar = (name: string) => {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return initials;
    };

    const getRoleDisplay = () => {
        switch (userRole) {
            case 'ADMIN':
                return {
                    label: 'Administrador',
                    color: 'bg-red-500 text-white',
                    icon: <IconCrown className="h-3 w-3" />
                };
            case 'MANAGER':
                return {
                    label: 'Gerente',
                    color: 'bg-blue-500 text-white',
                    icon: <IconBriefcase className="h-3 w-3" />
                };
            case 'WORKER':
                return {
                    label: 'Trabajador',
                    color: 'bg-green-500 text-white',
                    icon: <IconUser className="h-3 w-3" />
                };
            default:
                return {
                    label: 'Usuario',
                    color: 'bg-gray-500 text-white',
                    icon: <IconUser className="h-3 w-3" />
                };
        }
    };

    // Use authenticated user data if available, fallback to prop data
    const displayUser = authUser ? {
        name: authUser.fullName || authUser.userName,
        email: authUser.email || 'Sin email',
        avatar: user.avatar,
        role: authUser.role || 'WORKER',
        status: authUser.status || 'activo'
    } : {
        ...user,
        role: 'WORKER' as const,
        status: 'activo' as const
    };

    const roleDisplay = getRoleDisplay();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground relative"
                        >
                            <div className="relative">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                                        {generateAvatar(displayUser.name || 'Usuario')}
                                    </AvatarFallback>
                                </Avatar>

                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-medium">{displayUser.name}</span>
                                    <Badge className={`text-xs px-1.5 py-0.5 ${roleDisplay.color}`}>
                                        <div className="flex items-center gap-1">
                                            {roleDisplay.icon}
                                            {roleDisplay.label}
                                        </div>
                                    </Badge>
                                </div>
                                <span className="text-muted-foreground truncate text-xs">
                                    {displayUser.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <IconDotsVertical className="ml-auto size-4" />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <div className="relative">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">
                                            {generateAvatar(displayUser.name || 'Usuario')}
                                        </AvatarFallback>
                                    </Avatar>

                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="truncate font-medium">{displayUser.name}</span>
                                        <Badge className={`text-xs px-1.5 py-0.5 ${roleDisplay.color}`}>
                                            <div className="flex items-center gap-1">
                                                {roleDisplay.icon}
                                                {roleDisplay.label}
                                            </div>
                                        </Badge>
                                    </div>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {displayUser.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                                <IconUserCircle />
                                Mi Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                                <IconSettings />
                                Configuración
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/dashboard/change-password')}>
                                <IconKey />
                                Cambiar contraseña
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <IconLogout />
                            Salir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}