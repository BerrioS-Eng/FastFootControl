'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { ExpenseDTO } from '@/app/dashboard/expenses/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Helpers inline para manejar el formato del input datetime-local sin utilidades externas.
// 1) Para inicializar el input desde un ISO (backend): convertir a local "YYYY-MM-DDTHH:mm".
function isoToLocalInput(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    // Corrige a hora local, recorta a minutos
    const tzOffset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
}

// 2) Para enviar al backend: convertir el valor de input (local) a ISO.
function localInputToIso(localValue: string) {
    if (!localValue) return new Date().toISOString()
    // new Date sobre "YYYY-MM-DDTHH:mm" lo toma como local; al serializar con toISOString() queda en UTC ISO
    return new Date(localValue).toISOString()
}

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (payload: ExpenseDTO, expenseId?: number) => Promise<void> | void
    initialData?: ExpenseDTO
}

const empty: ExpenseDTO = {
    expenseDate: new Date().toISOString(),
    type: '',
    concept: '',
    totalPrice: 0,
}

export default function ExpenseForm({ open, onClose, onSubmit, initialData }: Props) {
    const isEdit = Boolean(initialData?.expenseId)

    const [form, setForm] = useState<ExpenseDTO>(empty)
    const [expenseDateLocal, setExpenseDateLocal] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setError(null)
            setSubmitting(false)
            const base = initialData ? { ...initialData } : { ...empty }
            setForm(base)
            setExpenseDateLocal(isoToLocalInput(base.expenseDate))
        }
    }, [open, initialData])

    const title = useMemo(() => (isEdit ? 'Editar gasto' : 'Agregar gasto'), [isEdit])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => {
            if (name === 'totalPrice') return { ...prev, totalPrice: Number(value) }
            if (name === 'type') return { ...prev, type: value }
            if (name === 'concept') return { ...prev, concept: value }
            return prev
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            setError(null)
            const payload: ExpenseDTO = {
                ...form,
                expenseDate: localInputToIso(expenseDateLocal),
            }
            await onSubmit(payload, initialData?.expenseId)
            onClose()
        } catch (err: any) {
            setError(err?.message ?? 'Error al guardar el gasto')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
            <DialogContent className="sm:max-w-lg" aria-describedby="expense-form-description">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="expenseDate">Fecha</Label>
                            <Input
                                id="expenseDate"
                                type="datetime-local"
                                name="expenseDate"
                                value={expenseDateLocal}
                                onChange={(e) => setExpenseDateLocal(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Input
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                placeholder="Ej. Insumos, Servicios, etc."
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:col-span-2">
                            <Label htmlFor="concept">Concepto</Label>
                            <Input
                                id="concept"
                                name="concept"
                                value={form.concept}
                                onChange={handleChange}
                                placeholder="Descripción del gasto"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="totalPrice">Total</Label>
                            <Input
                                id="totalPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                name="totalPrice"
                                value={Number(form.totalPrice ?? 0)}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Agregar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}