"use client";

import {useEffect, useState} from "react";
import {UsersService} from "@/app/dashboard/users/services/users.service";
import type {UserLoginResponse} from "@/lib/auth/types";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    IconUser,
    IconShieldCheck,
    IconId,
    IconRefresh,
} from "@tabler/icons-react";
import {toast} from "sonner";

export default function AccountPage() {
    const [user, setUser] = useState<UserLoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadMe = async () => {
        try {
            setIsLoading(true);
            const me = await UsersService.getCurrentUser();
            setUser(me);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo obtener la información de la cuenta");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMe();
    }, []);

    const generateAvatar = (userName: string | undefined) => {
        if (!userName) return "U";
        return userName
            .slice(0, 2)
            .toUpperCase();
    };

    const roleColor =
        user?.role === "ADMIN" ? "bg-red-500 text-white" : "bg-blue-500 text-white";

    const roleLabel =
        user?.role === "ADMIN" ? "Administrador" : "Trabajador";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 border-2 border-primary border-b-transparent rounded-full animate-spin"/>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Error al cargar la cuenta</CardTitle>
                        <CardDescription>
                            No se pudo obtener la información del usuario actual.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                        <Button onClick={loadMe} variant="outline">
                            <IconRefresh className="h-4 w-4 mr-2"/>
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <IconUser className="h-6 w-6 text-orange-600"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Mi cuenta</h1>
                            <p className="text-sm text-muted-foreground">
                                Información básica de tu perfil y rol en el sistema.
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-orange-500 text-white">
                                {generateAvatar(user.userName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle>{user.userName}</CardTitle>
                            <CardDescription>ID de usuario: {user.userId}</CardDescription>
                        </div>
                        <div className="ml-auto">
                            <Badge className={roleColor}>{roleLabel}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                            <IconId className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-muted-foreground">
                Identificador interno: <span className="font-mono">{user.userId}</span>
              </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <IconShieldCheck className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-muted-foreground">
                Rol en el sistema: <span className="font-medium">{user.role}</span>
              </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}