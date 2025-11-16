import { useCallback } from 'react';
import type { ExpenseDTO } from '@/app/dashboard/expenses/types';
import { expensesService } from '@/app/dashboard/expenses/services/expense.service';

type UseExpenseActionsArgs = {
    reload: () => Promise<void> | void;
};

export function useExpenseActions({ reload }: UseExpenseActionsArgs) {
    const createOne = useCallback(
        async (payload: ExpenseDTO) => {
            await expensesService.create(payload);
            await reload();
        },
        [reload]
    );

    const updateOne = useCallback(
        async (expenseId: number, payload: ExpenseDTO) => {
            await expensesService.update(expenseId, payload);
            await reload();
        },
        [reload]
    );

    const removeOne = useCallback(
        async (expenseId: number) => {
            await expensesService.remove(expenseId);
            await reload();
        },
        [reload]
    );

    const handleSubmit = useCallback(
        async (payload: ExpenseDTO, expenseId?: number) => {
            if (expenseId) {
                await updateOne(expenseId, payload);
            } else {
                await createOne(payload);
            }
        },
        [createOne, updateOne]
    );

    return {
        createOne,
        updateOne,
        removeOne,
        handleSubmit,
    };
}