'use client'

import React, { useCallback, useState } from 'react'
import ExpenseForm from '@/app/dashboard/expenses/components/ExpenseForm'
import ExpensesTable from '@/app/dashboard/expenses/components/ExpensesTable'
import { useExpenses } from '@/app/dashboard/expenses/hooks/useExpenses'
import { useExpenseActions } from '@/app/dashboard/expenses/hooks/useExpenseActions'
import { useConfirmDelete } from '@/app/dashboard/expenses/hooks/useConfirmDelete'
import type { ExpenseDTO } from '@/app/dashboard/expenses/types'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import type { Role } from '@/lib/auth/types'

type Props = {
    role: Role;
};

export default function ExpensesModule({ role }: Props) {
    const { data, loading, error, reload } = useExpenses()

    const { handleSubmit, removeOne } = useExpenseActions({ reload })

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<ExpenseDTO | undefined>(undefined)

    const { item: pendingDelete, openConfirm, cancel, confirm } = useConfirmDelete<ExpenseDTO>(removeOne)

    const isAdmin = role === 'ADMIN'
    const isWorker = role === 'WORKER'

    const openCreate = useCallback(() => {
        setEditing(undefined)
        setModalOpen(true)
    }, [])

    const openEdit = useCallback((row: ExpenseDTO) => {
        setEditing(row)
        setModalOpen(true)
    }, [])

    const closeModal = useCallback(() => setModalOpen(false), [])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Gastos</h2>
                <Button onClick={openCreate} disabled={!isAdmin && !isWorker}>
                    Agregar gasto
                </Button>
            </div>

            {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                    <button onClick={reload} className="ml-3 underline">
                        Reintentar
                    </button>
                </div>
            )}

            <ExpensesTable
                data={data}
                loading={loading}
                onEdit={openEdit}
                onDelete={openConfirm}
                canEdit={isAdmin}
                canDelete={isAdmin}
            />

            <ExpenseForm
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialData={editing}
            />

            <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && cancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Seguro que deseas eliminar este gasto? Esta acción no se puede deshacer.
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
    )
}