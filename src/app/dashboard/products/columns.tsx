"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteProduct from "@/components/products/DeleteProduct";
import { Product } from "./types";

function ActionsCell({ product }: { product: Product }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(String(product.id || ''))}
                    >
                        Copiar ID del producto
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Editar Producto</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Eliminar Producto
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteProduct
                id={String(product.id || '')}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDeleteSuccess={() => {
                    // Optionally trigger a data refresh here
                    console.log(`Producto con ID ${product.id} eliminado`);
                }}
            />
        </>
    );
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Nombre producto",
    },
    {
        accessorKey: "price",
        header: "Precio",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
            }).format(price)
 
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "category",
        header: "Categoría",
    },
    {
        accessorKey: "availability",
        header: "Disponible",
        cell: ({ row }) => {
            const available = row.getValue("availability") as boolean;
            return (
                <div className={`font-medium ${available ? 'text-green-600' : 'text-red-600'}`}>
                    {available ? 'Sí' : 'No'}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell product={row.original} />
    }
];