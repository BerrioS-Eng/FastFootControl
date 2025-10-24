'use client';
import {useEffect, useMemo, useState} from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Item {
    nombre: string;
    precio: string;
}

interface InputListCustomProps {
    value?: Item[];
    onChange?: (items: Item[]) => void;
}

export default function InputListCustom({ value = [], onChange }: InputListCustomProps) {
    // Estados solo para los campos de entrada y edición, NO para la lista
    const [nombre, setNombre] = useState<string>('');
    const [precio, setPrecio] = useState<string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    // Usa siempre el valor controlado que viene de props
    const items = useMemo(() => value ?? [], [value]);

    const addItem = () => {
        if (!nombre || !precio) return;
        const next = [...items, { nombre, precio }];
        onChange?.(next);
        setNombre('');
        setPrecio('');
    };

    const handleEdit = (index: number, item: Item) => {
        setEditIndex(index);
        setEditValue(`${item.nombre}: $${item.precio}`);
    };

    const saveEdit = (index: number) => {
        const [n, p] = editValue.split(': $');
        const next = [...items];
        next[index] = { nombre: (n ?? '').trim(), precio: (p ?? '').trim() };
        onChange?.(next);
        setEditIndex(null);
        setEditValue('');
    };

    const deleteItem = (index: number) => {
        const next = items.filter((_, i) => i !== index);
        onChange?.(next);
    };

    // Si el padre resetea el valor a [], limpia también los campos locales de entrada/edición
    useEffect(() => {
        if (!items || items.length === 0) {
            setNombre('');
            setPrecio('');
            setEditIndex(null);
            setEditValue('');
        }
    }, [items]);

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <Input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    className="p-2 border rounded"
                />
                <Input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Precio"
                    step="0.01"
                    className="p-2 border rounded"
                />
                <Button
                    onClick={addItem}
                    className="p-3 bg-gray-400 rounded-full hover:bg-black cursor-pointer"
                    type="button"
                >
                    +
                </Button>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="p-0.5 bg-gray-100 rounded border flex justify-between items-center cursor-pointer"
                        onDoubleClick={() => handleEdit(index, item)}
                    >
                        {editIndex === index ? (
                            <div className="flex justify-between gap-2">
                                <div>
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="p-1 border rounded"
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => saveEdit(index)}
                                        className="px-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700"
                                        type='button'
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => deleteItem(index)}
                                        className="p-3.5 h-9 w-9 rounded-full flex justify-between items-center cursor-pointer bg-red-500 text-white  hover:bg-red-600"
                                        type='button'
                                    >
                                        <span>X</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <span>{`${item.nombre}: $${item.precio}`}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}