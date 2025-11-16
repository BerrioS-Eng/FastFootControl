import React from 'react';
import type { ExpenseDTO } from '@/app/dashboard/expenses/types';
import { expensesService } from '@/app/dashboard/expenses/services/expense.service';

export function useExpenses() {
    const [data, setData] = React.useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const reload = React.useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const list = await expensesService.getAll();
            setData(list);
        } catch (e: any) {
            setError(e?.message || 'No se pudo cargar');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { void reload(); }, [reload]);

    return { data, loading, error, reload };
}