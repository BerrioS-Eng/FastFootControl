'use client'

import React, { useCallback, useMemo, useState } from 'react'
import ExpenseForm from '@/app/dashboard/expenses/components/ExpenseForm'
import ExpensesTable from '@/app/dashboard/expenses/components/ExpensesTable'
import { useExpenses } from '@/app/dashboard/expenses/hooks/useExpenses'
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

export default function ExpensesModule() {
    const { items, loading, error, reload, createOne, updateOne, removeOne } = useExpenses()

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<ExpenseDTO | undefined>(undefined)
    const [pendingDelete, setPendingDelete] = useState<ExpenseDTO | null>(null)

    const openCreate = useCallback(() => {
        setEditing(undefined)
        setModalOpen(true)
    }, [])

    const openEdit = useCallback((row: ExpenseDTO) => {
        setEditing(row)
        setModalOpen(true)
    }, [])

    const closeModal = useCallback(() => setModalOpen(false), [])

    const handleSubmit = useCallback(
        async (payload: ExpenseDTO, expenseId?: number) => {
            if (expenseId) await updateOne(expenseId, payload)
            else await createOne(payload)
        },
        [createOne, updateOne]
    )

    const confirmDelete = useCallback((row: ExpenseDTO) => setPendingDelete(row), [])

    const performDelete = useCallback(async () => {
        if (pendingDelete?.expenseId) {
            await removeOne(pendingDelete.expenseId)
        }
        setPendingDelete(null)
    }, [pendingDelete, removeOne])

    const headerRight = useMemo(
        () => (
            <Button onClick={openCreate}>Agregar gasto</Button>
        ),
        [openCreate]
    )

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Gastos</h2>
                {headerRight}
            </div>

            {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                    <button onClick={reload} className="ml-3 underline">Reintentar</button>
                </div>
            )}

            <ExpensesTable data={items} loading={loading} onEdit={openEdit} onDelete={confirmDelete} />

            <ExpenseForm
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialData={editing}
            />

            <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Seguro que deseas eliminar este gasto? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={performDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}