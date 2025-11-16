'use client';
import { http } from '@/lib/api/http';
import type { ExpenseDTO } from '@/app/dashboard/expenses/types';

export const ExpensesAPI = {
    // Create
    create: (payload: ExpenseDTO) =>
        http<ExpenseDTO>("", "/api/expenses", { method: "POST", body: JSON.stringify(payload) }),

    // Read
    getAll: () => http<ExpenseDTO[]>("", "/api/expenses/all"),
    getById: (id: string | number) => http<ExpenseDTO>("", `/api/expenses/${id}`),

    // Update (only ADMIN)
    update: (id: string | number, payload: ExpenseDTO) =>
        http<ExpenseDTO>("", `/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

    // Delete (only ADMIN)
    remove: (id: string | number) =>
        http<void>("", `/api/expenses/${id}`, { method: "DELETE" }),
};