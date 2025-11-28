"use client";

import React, { useCallback, useMemo, useState } from "react";
import ExpenseForm from "@/app/dashboard/expenses/components/ExpenseForm";
import ExpensesTable from "@/app/dashboard/expenses/components/ExpensesTable";
import { useExpenses } from "@/app/dashboard/expenses/hooks/useExpenses";
import { useExpenseActions } from "@/app/dashboard/expenses/hooks/useExpenseActions";
import { useConfirmDelete } from "@/app/dashboard/expenses/hooks/useConfirmDelete";
import type { ExpenseDTO } from "@/app/dashboard/expenses/types";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import type { Role } from "@/lib/auth/types";
import { IconPlus, IconReceiptDollar } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils";

type Props = {
    role: Role;
};

export default function ExpensesModule({ role }: Props) {
    const { data, loading, error, reload } = useExpenses();
    const { handleSubmit, removeOne } = useExpenseActions({ reload });

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ExpenseDTO | undefined>(undefined);

    const { item: pendingDelete, openConfirm, cancel, confirm } =
        useConfirmDelete<ExpenseDTO>(removeOne);

    const isAdmin = role === "ADMIN";
    const isWorker = role === "WORKER";

    const openCreate = useCallback(() => {
        setEditing(undefined);
        setModalOpen(true);
    }, []);

    const openEdit = useCallback((row: ExpenseDTO) => {
        setEditing(row);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => setModalOpen(false), []);

    const totalExpenses = useMemo(
        () =>
            (data ?? []).reduce(
                (acc, exp) => acc + (Number(exp.totalPrice) || 0),
                0,
            ),
        [data],
    );

    const countExpenses = data?.length ?? 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Hero */}
            <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* círculo decorativo */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/10" />

                <div className="relative z-10 flex items-start gap-3">
                    <div className="hidden sm:flex h-10 w-10 rounded-full bg-white/20 items-center justify-center my-auto">
                        <IconReceiptDollar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-1">Control de gastos</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Gestión de gastos
                        </h1>
                        <p className="text-sm md:text-base opacity-90">
                            Registra y revisa los egresos diarios.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm">
                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                {countExpenses} registro
                                {countExpenses === 1 ? "" : "s"} de gasto
                            </span>
                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold">
                                Total:{' '}
                                <span className="ml-1">
                                    {formatCurrency(totalExpenses, "es-CO", "COP")}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
                    <Button
                        onClick={openCreate}
                        disabled={!isAdmin && !isWorker}
                        className="mt-1 bg-white text-rose-600 hover:bg-rose-50 font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-2 disabled:opacity-60"
                    >
                        <IconPlus className="h-4 w-4" />
                        Agregar gasto
                    </Button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-3">
                    <span>{error}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={reload}
                        className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                        Reintentar
                    </Button>
                </div>
            )}

            {/* Tabla */}
            <ExpensesTable
                data={data}
                loading={loading}
                onEdit={openEdit}
                onDelete={openConfirm}
                canEdit={isAdmin}
                canDelete={isAdmin}
            />

            {/* Modal de formulario */}
            <ExpenseForm
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialData={editing}
            />

            {/* Confirmación de borrado */}
            <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && cancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Seguro que deseas eliminar este gasto? Esta acción no se puede
                            deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}