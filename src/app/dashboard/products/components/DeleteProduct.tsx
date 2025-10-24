"use client";
import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import {useDeleteProduct} from "@/app/dashboard/products/hooks/useDeleteProduct";

interface DeleteProductProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleteSuccess?: () => void; // Optional callback for parent to handle success
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ id, open, onOpenChange, onDeleteSuccess }) => {
    const { mutateAsync, isPending } = useDeleteProduct();
    const handleDelete = async () => {
        try {
            const numericId = Number(id);
            if (!Number.isFinite(numericId)) {
                throw new Error('ID de producto inválido');
            }
            await mutateAsync(numericId);
            toast("Éxito", { description: `Producto con ID ${id} eliminado correctamente.` });
            onDeleteSuccess?.();
            onOpenChange(false);
        } catch (error: any) {
            toast("Error", { description: error?.message || "No se pudo eliminar el producto." });
            console.error('Error al eliminar:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>¿Está seguro que desea eliminar el producto?</DialogTitle>
                    <DialogDescription>
                        El producto a eliminar es {id}.<br/>
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={isPending}>Cancelar</Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteProduct;