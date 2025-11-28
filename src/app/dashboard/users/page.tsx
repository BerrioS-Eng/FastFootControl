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
    const {role, authLoading} = useAuth(); // Role = "ADMIN" | "WORKER" | undefined
    const isAdmin = role === "ADMIN";

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-10 w-10 border-2 border-primary border-b-transparent rounded-full animate-spin"/>
            </div>
        );
    }

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

    // Solo ADMIN llega aquí
    return <UsersAdminContent/>;
}

function UsersAdminContent() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserDTO | null>(null);

    const loadUsers = async () => {
        try {
            setUsersLoading(true);
            const data = await UsersService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron cargar los usuarios");
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();
    }, []);

    const totalUsers = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const workers = users.filter((u) => u.role === "WORKER").length;

    return (
        <div className="p-4 sm:px-6 space-y-6">
            {/* Hero */}
            <div
                className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-[#FF9800] to-[#FF3D00] text-white shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* círculo decorativo */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/10"/>
                <div className="relative z-10 flex items-start gap-3">
                    <div className="hidden sm:flex h-10 w-10 rounded-full bg-white/20 items-center justify-center my-auto">
                        <IconUsers className="h-5 w-5"/>
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-1">Administración</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Gestión de usuarios
                        </h1>
                        <p className="text-sm md:text-base opacity-90">
                            Administra las cuentas de acceso y roles del sistema.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm">
                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                {totalUsers} usuario{totalUsers === 1 ? "" : "s"}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                {admins} ADMIN • {workers} WORKER
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-1 bg-white text-[#F4511E] cursor-pointer hover:bg-orange-50 font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
                    >
                        <IconPlus className="h-4 w-4"/>
                        Nuevo usuario
                    </Button>
                </div>
            </div>

            {/* Contenido */}
            {usersLoading ? (
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