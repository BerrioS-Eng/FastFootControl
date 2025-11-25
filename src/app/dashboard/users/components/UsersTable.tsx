"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import type {UserDTO} from "@/lib/auth/types";

type UsersTableProps = {
    users: UserDTO[];
    onEdit: (user: UserDTO) => void;
    onDelete: (user: UserDTO) => void;
};

export function UsersTable({users, onEdit, onDelete}: UsersTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                                No hay usuarios registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((u) => (
                            <TableRow key={u.userId}>
                                <TableCell>{u.userId}</TableCell>
                                <TableCell>{u.userName}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => onEdit(u)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => onDelete(u)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}