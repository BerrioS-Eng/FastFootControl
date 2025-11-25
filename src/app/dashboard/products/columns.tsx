"use client";
import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteProduct from "./components/DeleteProduct";
import {Product} from "./types";

export const columns = ({onEdit}: { onEdit: (id: number) => void }): ColumnDef<Product>[] => [
    {
        accessorKey: "name",
        header: "Nombre producto",
    },
    {
        accessorKey: "netPrice",
        header: "Precio neto",
    },
    {
        accessorKey: "profitMargin",
        header: "Margen ganancia",
    },
    {
        accessorKey: "salePrice",
        header: "Precio venta",
    },
    {
        id: "actions",
        cell: ({row}) => {
            const product = row.original;
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(product.id.toString())}
                            >
                                Copiar ID del producto
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={() => onEdit(product.id)}
                            >
                                Editar Producto
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                Eliminar Producto
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DeleteProduct
                        id={product.id.toString()}
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onDeleteSuccess={() => {
                            console.log(`Producto con ID ${product.id.toString()} eliminado`);
                        }}
                    />

                </>
            );
        },
    },
];