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
    IconHistory,
    IconShieldCheck,
    IconUser
} from "@tabler/icons-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function NavUser({
    user,
}: {
    user: {
        name: string,
        email: string,
        avatar: string
    }
}) {
    const { isMobile } = useSidebar();
    const { logout, user: authUser } = useAuth();
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);

    // Simular cambios de estado online/offline
    useEffect(() => {
        const interval = setInterval(() => {
            // Simular que el usuario está siempre online para este ejemplo
            setIsOnline(true);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Generar avatar basado en iniciales
    const generateAvatar = (name: string) => {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return initials;
    };

    // Obtener color del rol
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500 text-white';
            case 'trabajador':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    // Obtener icono del rol
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <IconShieldCheck className="h-3 w-3" />;
            case 'trabajador':
                return <IconUser className="h-3 w-3" />;
            default:
                return <IconUser className="h-3 w-3" />;
        }
    };

    // Use authenticated user data if available
    const displayUser = authUser ? {
        name: authUser.fullName || authUser.userName,
        email: authUser.email,
        avatar: user.avatar,
        role: authUser.role,
        status: authUser.status,
        lastAccess: authUser.lastAccess
    } : {
        ...user,
        role: 'trabajador' as const,
        status: 'activo' as const,
        lastAccess: new Date()
    };

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
                                {/* Indicador de estado online/offline */}
                                <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-medium">{displayUser.name}</span>
                                    {authUser && (
                                        <Badge className={`text-xs px-1.5 py-0.5 ${getRoleColor(displayUser.role || 'trabajador')}`}>
                                            <div className="flex items-center gap-1">
                                                {getRoleIcon(displayUser.role || 'trabajador')}
                                                {displayUser.role === 'admin' ? 'Admin' : 'Trabajador'}
                                            </div>
                                        </Badge>
                                    )}
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
                                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="truncate font-medium">{displayUser.name}</span>
                                        <Badge className={`text-xs px-1.5 py-0.5 ${getRoleColor(displayUser.role)}`}>
                                            <div className="flex items-center gap-1">
                                                {getRoleIcon(displayUser.role)}
                                                {displayUser.role === 'admin' ? 'Admin' : 'Trabajador'}
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
                            <DropdownMenuItem onClick={() => router.push('/dashboard/activity')}>
                                <IconHistory />
                                Historial de actividad
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