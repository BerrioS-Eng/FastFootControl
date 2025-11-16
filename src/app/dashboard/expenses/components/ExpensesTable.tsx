'use client'

import React from 'react'
import type { ExpenseDTO } from '@/app/dashboard/expenses/types'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

type Props = {
    data: ExpenseDTO[]
    loading?: boolean
    onEdit: (row: ExpenseDTO) => void
    onDelete: (row: ExpenseDTO) => void
    canEdit?: boolean
    canDelete?: boolean
}

export default function ExpensesTable({ data, loading, onEdit, onDelete, canEdit = false, canDelete = false }: Props) {
    const hasData = (data?.length ?? 0) > 0

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                Cargando…
                            </TableCell>
                        </TableRow>
                    ) : hasData ? (
                        data.map((row) => {
                            const dateLabel = row.expenseDate ? new Date(row.expenseDate).toLocaleString() : '-'
                            return (
                                <TableRow key={row.expenseId ?? `${row.concept}-${row.expenseDate}`}>
                                    <TableCell>{row.expenseId ?? '-'}</TableCell>
                                    <TableCell>{dateLabel}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell className="max-w-[320px] truncate" title={row.concept}>
                                        {row.concept}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${Number(row.totalPrice ?? 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => onEdit(row)} disabled={!canEdit}>
                                                Editar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => onDelete(row)} disabled={!canDelete}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                Sin registros
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}