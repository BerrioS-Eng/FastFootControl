import type {ExpenseDTO} from '@/app/dashboard/expenses/types';
import {ExpensesAPI} from '@/app/dashboard/expenses/api/expenses';

export const expensesService = {
    create: (p: ExpenseDTO) => ExpensesAPI.create(p),
    getAll: () => ExpensesAPI.getAll(),
    getById: (id: string | number) => ExpensesAPI.getById(id),
    update: (id: string | number, p: ExpenseDTO) => ExpensesAPI.update(id, p),
    remove: (id: string | number) => ExpensesAPI.remove(id),
    getByDay: (dateYmd: string) => ExpensesAPI.getByDay(dateYmd),
    getByDateRange: (startIso: string, endIso: string) =>
        ExpensesAPI.getByDateRange(startIso, endIso),
};
