"use client";
import {useEffect, useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface Item {
    nombre: string;
    precio: string;
}

interface InputListCustomProps {
    value?: Item[];
    onChange?: (items: Item[]) => void;
}

export default function InputListCustom({value = [], onChange}: InputListCustomProps) {
    const [nombre, setNombre] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const items = useMemo(() => value ?? [], [value]);

    const addItem = () => {
        if (!nombre.trim() || !precio.trim()) return;
        const next = [...items, {nombre: nombre.trim(), precio: precio.trim()}];
        onChange?.(next);
        setNombre("");
        setPrecio("");
    };

    const handleEdit = (index: number, item: Item) => {
        setEditIndex(index);
        setEditValue(`${item.nombre}: $${item.precio}`);
    };

    const saveEdit = (index: number) => {
        const [n, p] = editValue.split(": $");
        const next = [...items];
        next[index] = {nombre: (n ?? "").trim(), precio: (p ?? "").trim()};
        onChange?.(next);
        setEditIndex(null);
        setEditValue("");
    };

    const deleteItem = (index: number) => {
        const next = items.filter((_, i) => i !== index);
        onChange?.(next);
    };

    useEffect(() => {
        if (!items || items.length === 0) {
            setNombre("");
            setPrecio("");
            setEditIndex(null);
            setEditValue("");
        }
    }, [items]);

    return (
        <div className="space-y-3">
            {/* Fila de entrada */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    className="h-9 sm:flex-1"
                />
                <Input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Precio"
                    step="0.01"
                    className="h-9 sm:w-28"
                />
                <Button
                    type="button"
                    onClick={addItem}
                    className="h-9 sm:w-9 w-full rounded-full sm:rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 px-0"
                >
                    +
                </Button>
            </div>

            {/* Lista de ítems (sin scroll interno) */}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm"
                        onDoubleClick={() => handleEdit(index, item)}
                    >
                        {editIndex === index ? (
                            <div className="flex w-full items-center gap-2">
                                <Input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="h-8 text-xs"
                                />
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        onClick={() => saveEdit(index)}
                                        className="h-8 px-2 text-xs"
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="h-8 w-8 px-0 text-xs"
                                        onClick={() => deleteItem(index)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span className="truncate">
                                    {item.nombre}: ${item.precio}
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-7 px-2 text-[11px]"
                                        onClick={() => handleEdit(index, item)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-7 w-7 px-0 text-destructive"
                                        onClick={() => deleteItem(index)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                        No hay costos añadidos aún.
                    </p>
                )}
            </div>
        </div>
    );
}