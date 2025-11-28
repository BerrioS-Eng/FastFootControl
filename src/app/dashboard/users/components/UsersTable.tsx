"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import type {UserDTO} from "@/lib/auth/types";
import BadgeTagRole from "@/components/ui/BadgeTagRole";

type UsersTableProps = {
    users: UserDTO[];
    onEdit: (user: UserDTO) => void;
    onDelete: (user: UserDTO) => void;
};

export function UsersTable({users, onEdit, onDelete}: UsersTableProps) {
    const hasUsers = users.length > 0;

    return (
        <div className="overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-[80px] text-xs font-semibold uppercase tracking-wide">
                                ID
                            </TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">
                                Usuario
                            </TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">
                                Rol
                            </TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!hasUsers ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-6 text-sm text-muted-foreground"
                                >
                                    No hay usuarios registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u, idx) => (
                                <TableRow
                                    key={u.userId}
                                    className={
                                        idx % 2 === 0
                                            ? "bg-white hover:bg-muted/40"
                                            : "bg-muted/10 hover:bg-muted/50"
                                    }
                                >
                                    <TableCell className="text-sm">{u.userId}</TableCell>
                                    <TableCell className="text-sm">{u.userName}</TableCell>
                                    <TableCell className="text-sm">
                                        <BadgeTagRole role={u.role}/>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEdit(u)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onDelete(u)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}