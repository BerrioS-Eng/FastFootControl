'use client';

import { ENDPOINTS } from '@/lib/config';
import { ExpenseDTO } from '@/app/dashboard/expenses/types';

const BASE = ENDPOINTS.expenses;

// Endpoints del backend:
// POST   /expenses/create-expense
// PUT    /expenses/edit-expense?expenseId=ID
// GET    /expenses/get-all-expenses
// GET    /expenses/get-expense-by-id?expenseId=ID
// DELETE /expenses/delete-expense?expenseId=ID

export async function getAllExpenses(): Promise<ExpenseDTO[]> {
    const res = await fetch(`${BASE}/get-all-expenses`, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo obtener la lista de gastos');
    return res.json();
}

export async function getExpenseById(expenseId: number): Promise<ExpenseDTO> {
    const res = await fetch(`${BASE}/get-expense-by-id?expenseId=${expenseId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo obtener el gasto');
    return res.json();
}

export async function createExpense(payload: ExpenseDTO): Promise<ExpenseDTO> {
    const res = await fetch(`${BASE}/create-expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('No se pudo crear el gasto');
    return res.json();
}

export async function editExpense(expenseId: number, payload: ExpenseDTO): Promise<ExpenseDTO> {
    const res = await fetch(`${BASE}/edit-expense?expenseId=${expenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('No se pudo editar el gasto');
    return res.json();
}

export async function deleteExpense(expenseId: number): Promise<void> {
    const res = await fetch(`${BASE}/delete-expense?expenseId=${expenseId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo eliminar el gasto');
}