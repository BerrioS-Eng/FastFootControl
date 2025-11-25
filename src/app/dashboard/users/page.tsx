"use client";

import {useState, useEffect} from "react";
import {UsersTable} from "@/app/dashboard/users/components/UsersTable";
import {CreateUserModal} from "@/app/dashboard/users/components/CreateUserModal";
import {EditUserModal} from "@/app/dashboard/users/components/EditUserModal";
import {DeleteUserModal} from "@/app/dashboard/users/components/DeleteUserModal";
import {UsersService} from "@/app/dashboard/users/services/users.service";
import type {UserDTO} from "@/lib/auth/types";
import {useAuth} from "@/app/dashboard/users/hooks/useAuth";
import {Button} from "@/components/ui/button";
import {IconUsers, IconAlertTriangle, IconPlus} from "@tabler/icons-react";
import {toast} from "sonner";

export default function UsersPage() {
    const {role} = useAuth(); // Role = "ADMIN" | "WORKER" | undefined
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserDTO | null>(null);

    const isAdmin = role === "ADMIN";

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await UsersService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron cargar los usuarios");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        } else {
            setIsLoading(false);
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600">
                        <IconAlertTriangle className="h-5 w-5"/>
                        <h1 className="font-semibold text-lg">Acceso restringido</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Solo los usuarios con rol <span className="font-semibold">ADMIN</span> pueden
                        gestionar usuarios.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <IconUsers className="h-6 w-6 text-orange-600"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestión de usuarios</h1>
                        <p className="text-sm text-muted-foreground">
                            Administra las cuentas de acceso al sistema.
                        </p>
                    </div>
                </div>

                <Button onClick={() => setIsCreateOpen(true)} className="self-start">
                    <IconPlus className="h-4 w-4 mr-2"/>
                    Nuevo usuario
                </Button>
            </div>

            {/* Contenido */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="h-10 w-10 border-2 border-primary border-b-transparent rounded-full animate-spin"/>
                </div>
            ) : (
                <UsersTable
                    users={users}
                    onEdit={(u) => setEditingUser(u)}
                    onDelete={(u) => setDeletingUser(u)}
                />
            )}

            <CreateUserModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreated={loadUsers}
            />

            <EditUserModal
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
                user={editingUser}
                onUpdated={loadUsers}
            />

            <DeleteUserModal
                open={!!deletingUser}
                onOpenChange={(open) => !open && setDeletingUser(null)}
                user={deletingUser}
                onDeleted={loadUsers}
            />
        </div>
    );
}