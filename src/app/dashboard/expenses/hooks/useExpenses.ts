'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ExpenseDTO } from '@/app/dashboard/expenses/types';
import { createExpense, deleteExpense, editExpense, getAllExpenses } from '@/app/dashboard/expenses/api/expenses';

export function useExpenses() {
    const [items, setItems] = useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllExpenses();
            setItems(data);
        } catch (e: any) {
            setError(e?.message ?? 'Error al cargar gastos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const createOne = useCallback(async (payload: ExpenseDTO) => {
        const created = await createExpense(payload);
        setItems((prev) => [created, ...prev]);
        return created;
    }, []);

    const updateOne = useCallback(async (expenseId: number, payload: ExpenseDTO) => {
        const updated = await editExpense(expenseId, payload);
        setItems((prev) => prev.map((i) => (i.expenseId === expenseId ? updated : i)));
        return updated;
    }, []);

    const removeOne = useCallback(async (expenseId: number) => {
        await deleteExpense(expenseId);
        setItems((prev) => prev.filter((i) => i.expenseId !== expenseId));
    }, []);

    return useMemo(
        () => ({ items, loading, error, reload: load, createOne, updateOne, removeOne }),
        [error, items, load, createOne, updateOne, removeOne]
    );
}