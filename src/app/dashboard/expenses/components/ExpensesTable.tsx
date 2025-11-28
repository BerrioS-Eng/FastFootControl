"use client";

import React from "react";
import type {ExpenseDTO} from "@/app/dashboard/expenses/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {formatCurrency} from "@/lib/utils";

type Props = {
    data: ExpenseDTO[];
    loading?: boolean;
    onEdit: (row: ExpenseDTO) => void;
    onDelete: (row: ExpenseDTO) => void;
    canEdit?: boolean;
    canDelete?: boolean;
};

export default function ExpensesTable({
                                          data,
                                          loading,
                                          onEdit,
                                          onDelete,
                                          canEdit = false,
                                          canDelete = false,
                                      }: Props) {
    const hasData = (data?.length ?? 0) > 0;

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
                                Fecha
                            </TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">
                                Tipo
                            </TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wide">
                                Concepto
                            </TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                                Total
                            </TableHead>
                            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    Cargando…
                                </TableCell>
                            </TableRow>
                        ) : hasData ? (
                            data.map((row, idx) => {
                                const dateLabel = row.expenseDate
                                    ? new Date(row.expenseDate).toLocaleDateString("es-CO", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    : "-";
                                return (
                                    <TableRow
                                        key={row.expenseId ?? `${row.concept}-${row.expenseDate}`}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-white hover:bg-muted/40"
                                                : "bg-muted/10 hover:bg-muted/50"
                                        }
                                    >
                                        <TableCell className="text-sm">
                                            {row.expenseId ?? "-"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {dateLabel}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.type}
                                        </TableCell>
                                        <TableCell
                                            className="max-w-[320px] truncate text-sm"
                                            title={row.concept}
                                        >
                                            {row.concept}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-sm">
                                            {formatCurrency(
                                                Number(row.totalPrice),
                                                "es-CO",
                                                "COP",
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(row)}
                                                    disabled={!canEdit}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onDelete(row)}
                                                    disabled={!canDelete}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-6 text-muted-foreground text-sm"
                                >
                                    Sin registros
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}