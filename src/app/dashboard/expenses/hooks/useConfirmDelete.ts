import { useCallback, useState } from 'react';

export function useConfirmDelete<T extends { expenseId?: number }>(
    onDelete: (id: number) => Promise<void> | void
) {
    const [item, setItem] = useState<T | null>(null);

    const openConfirm = useCallback((row: T) => setItem(row), []);

    const cancel = useCallback(() => setItem(null), []);

    const confirm = useCallback(async () => {
        if (item?.expenseId != null) {
            await onDelete(item.expenseId);
        }
        setItem(null);
    }, [item, onDelete]);

    return {
        item,         // el gasto pendiente de borrar
        openConfirm,  // para setearlo
        cancel,       // para cerrar sin borrar
        confirm,      // para ejecutar el borrado
    };
}