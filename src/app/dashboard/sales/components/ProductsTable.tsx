"use client"
import React, {useEffect, useMemo, useState} from 'react'
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useProductsForSale} from "@/app/dashboard/products/hooks/useProductForSaleTable";
import {useCurrencyFormatter} from "@/hooks/useCurrencyFormatter";

type AvailableProduct = {
    id: string;
    product: string;
    salePrice: number;
};

// Fila que se agrega a la venta
type RowProduct = {
    id: string;
    product: string;
    quantity: number;
    salePrice: number;
    totalPrice: number;
};

type ProductTableProps = {
    value: RowProduct[];
    onChange: (products: RowProduct[]) => void;
};


export const ProductsTable: React.FC<ProductTableProps> = ({value, onChange}) => {
    const { data = [], isLoading, isError } = useProductsForSale();
    const { format } = useCurrencyFormatter('es-CO', 'COP', 2);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [editingQty, setEditingQty] = useState<number>(0);

    const availableProducts: AvailableProduct[] = useMemo(() => {
        return data.map((p) => ({ id: p.id, product: p.product, salePrice: p.salePrice }));
    }, [data]);

    const [newProduct, setNewProduct] = useState<{
        productId?: string;
        quantity: number;
        salePrice: number;
        totalPrice: number;
    }>({ productId: undefined, quantity: 1, salePrice: 0, totalPrice: 0 });

    useEffect(() => {
        const q = newProduct.quantity ?? 0;
        const sp = newProduct.salePrice ?? 0;
        setNewProduct((prev) => ({ ...prev, totalPrice: sp * q }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newProduct.quantity, newProduct.salePrice]);

    const handleAddProduct = () => {
        const qty = newProduct.quantity ?? 0;
        if (!newProduct.productId || qty <= 0) return;

        const selected = availableProducts.find((p) => p.id === newProduct.productId);
        if (!selected) return;

        const existingIndex = value.findIndex((p) => p.id === selected.id);
        if (existingIndex !== -1) {
            const updated = [...value];
            const existing = updated[existingIndex];
            const updatedQuantity = existing.quantity + qty;
            updated[existingIndex] = {
                ...existing,
                quantity: updatedQuantity,
                totalPrice: existing.salePrice * updatedQuantity,
            };
            onChange(updated);
        } else {
            const newEntry: RowProduct = {
                id: selected.id,
                product: selected.product,
                quantity: qty,
                salePrice: selected.salePrice,
                totalPrice: selected.salePrice * qty,
            };
            onChange([...value, newEntry]);
        }

        setNewProduct({ productId: '', quantity: 1, salePrice: 0, totalPrice: 0 });
    };

    const handleDelete = (id: string) => {
        onChange(value.filter((p) => p.id !== id));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddProduct();
        }
    };

    const handleSelectProduct = (id: string) => {
        const selected = availableProducts.find((p) => p.id === id);
        if (selected) {
            setNewProduct((prev) => ({
                ...prev,
                productId: selected.id,
                salePrice: selected.salePrice,
                totalPrice: selected.salePrice * (prev.quantity ?? 1),
            }));
        }
    };

    const startEditQty = (rowId: string, currentQty: number) => {
        setEditingRowId(rowId);
        setEditingQty(currentQty);
    };

    const commitEditQty = (rowId: string) => {
        const qty = Math.max(1, Number(editingQty) || 1);
        const next = value.map(r => {
            if (r.id !== rowId) return r;
            const newTotal = r.salePrice * qty;
            return { ...r, quantity: qty, totalPrice: newTotal };
        });
        onChange(next);
        setEditingRowId(null);
    };

    const cancelEditQty = () => {
        setEditingRowId(null);
    };

    const handleQtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowId: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitEditQty(rowId);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEditQty();
        }
    };

    return (
        <div className="mt-4">
            {isLoading && (
                <div className="text-gray-500 text-sm mb-2">Cargando productos…</div>
            )}
            {isError && (
                <div className="text-red-600 text-sm mb-2">Error al cargar productos</div>
            )}
            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="p-2 border">Producto</th>
                    <th className="p-2 border w-28">Cantidad</th>
                    <th className="p-2 border w-32">Precio Unitario</th>
                    <th className="p-2 border w-32">Precio Total</th>
                    <th className="p-2 border w-20 text-center">Acción</th>
                </tr>
                </thead>
                <tbody>
                {/* Fila editable */}
                <tr onKeyDownCapture={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddProduct(); } }}>
                    <td className="p-2 border">
                        <Select value={String(newProduct.productId ?? "")} onValueChange={handleSelectProduct}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar..."/>
                            </SelectTrigger>
                            <SelectContent>
                                {availableProducts.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.product}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </td>
                    <td className="p-2 border">
                        <Input
                            type="number"
                            min={1}
                            disabled={!newProduct.productId}
                            value={String(newProduct.quantity ?? "")}
                            onChange={(e) => setNewProduct((prev) => ({ ...prev, quantity: Number(e.target.value || 0) }))}
                            onKeyDown={handleKeyDown}
                        />
                    </td>
                    <td className="p-2 border text-right">
                        {format(newProduct.salePrice ?? 0)}
                    </td>
                    <td className="p-2 border text-right">
                        {format(newProduct.totalPrice ?? 0)}
                    </td>
                    <td className="p-2 border text-center">
                        <Button size="sm" type="button" onClick={handleAddProduct}>+</Button>
                    </td>
                </tr>

                {/* Filas de productos agregados */}
                {value.map((p) => (
                    <tr key={p.id}>
                        <td className="p-2 border">{p.product}</td>
                        <td
                            className="p-2 border text-right"
                            onDoubleClick={() => startEditQty(p.id, p.quantity)}
                        >
                            {editingRowId === p.id ? (
                                <Input
                                    autoFocus
                                    type="number"
                                    min={1}
                                    value={String(editingQty)}
                                    onChange={(e) => setEditingQty(Number(e.target.value || 0))}
                                    onBlur={() => commitEditQty(p.id)}
                                    onKeyDown={(e) => handleQtyKeyDown(e, p.id)}
                                    className="w-24 text-right"
                                />
                            ) : (
                                p.quantity
                            )}
                        </td>
                        <td className="p-2 border text-right">{format(p.salePrice)}</td>
                        <td className="p-2 border text-right">{format(p.totalPrice)}</td>
                        <td className="p-2 border text-center">
                            <Button variant="destructive" type="button" size="sm" onClick={() => handleDelete(p.id)}>
                                ✕
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}