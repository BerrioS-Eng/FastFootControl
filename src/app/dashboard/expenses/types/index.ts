export type ExpenseDTO = {
    expenseId?: number;
    expenseDate: string; // usar ISO string en el front; el backend lo mapea a LocalDateTime
    type: string;
    concept: string;
    totalPrice: number;
};