import React, {useEffect} from 'react';
import type {ExpenseDTO} from '@/app/dashboard/expenses/types';
import {expensesService} from '@/app/dashboard/expenses/services/expense.service';

type ExpensesFilter =
    | { mode: "all" }
    | { mode: "day"; dateYmd: string }
    | { mode: "range"; startIso: string; endIso: string };

async function loadExpenses(filter: ExpensesFilter): Promise<ExpenseDTO[]> {
    switch (filter.mode) {
        case "day":
            return await expensesService.getByDay(filter.dateYmd);
        case "range":
            return await expensesService.getByDateRange(filter.startIso, filter.endIso);
        case "all":
        default:
            return await expensesService.getAll();
    }
}

export function useExpenses(filter: ExpensesFilter) {
    const [data, setData] = React.useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // clave estable para saber cuándo cambió realmente el filtro
    const filterKey = React.useMemo(() => {
        switch (filter.mode) {
            case "day":
                return `day:${filter.dateYmd}`;
            case "range":
                return `range:${filter.startIso}-${filter.endIso}`;
            case "all":
            default:
                return "all";
        }
    }, [filter]);

    const reload = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await loadExpenses(filter);
            setData(list);
        } catch (e: any) {
            setError(e?.message || "No se pudo cargar");
        } finally {
            setLoading(false);
        }
    }, [filter]); // depende del filtro, pero el efecto usará filterKey

    useEffect(() => {
        void reload();
        // solo se vuelve a ejecutar cuando cambia realmente la “forma” del filtro
    }, [reload, filterKey]);

    return {data, loading, error, reload};
}