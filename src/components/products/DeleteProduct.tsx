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

interface DeleteProductProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleteSuccess?: () => void; // Optional callback for parent to handle success
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ id, open, onOpenChange, onDeleteSuccess }) => {

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
            toast("Exíto", {
                description: `Producto con ID ${id} eliminado correctamente.`,
            });
            onDeleteSuccess?.(); 
            onOpenChange(false); 
        } catch (error) {
            
            toast("Error", {
                description: "No se pudo eliminar el producto.",
            });
            console.error('Error:', error);
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
                        <Button type="button" variant="secondary">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteProduct;