"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import type {UserDTO} from "@/lib/auth/types";
import {UsersService} from "@/app/dashboard/users/services/users.service";
import {useState} from "react";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserDTO | null;
    onDeleted?: () => void;
};

export function DeleteUserModal({open, onOpenChange, user, onDeleted}: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        if (!user) return;
        try {
            setIsDeleting(true);
            await UsersService.deleteUser(user.userId);
            toast.success("Usuario eliminado correctamente");
            onOpenChange(false);
            onDeleted?.();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el usuario");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !isDeleting && onOpenChange(v)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar usuario</DialogTitle>
                    <DialogDescription>
                        ¿Seguro que deseas eliminar al usuario{" "}
                        <span className="font-semibold">{user?.userName}</span>? Esta
                        acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}