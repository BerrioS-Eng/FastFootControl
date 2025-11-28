"use client";

import React from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface ChartFilterBarProps {
    startLabel?: string;
    endLabel?: string;
    startValue: string;
    endValue: string;
    onChangeStart: (value: string) => void;
    onChangeEnd: (value: string) => void;
    onApply: () => void;
    cols?: number; // 2, 3, 4 según la card
}

export function ChartFilterBar({
                                   startLabel = "Inicio",
                                   endLabel = "Fin",
                                   startValue,
                                   endValue,
                                   onChangeStart,
                                   onChangeEnd,
                                   onApply,
                                   cols = 3,
                               }: ChartFilterBarProps) {
    const gridCols =
        cols === 4
            ? "sm:grid-cols-4"
            : cols === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-3";

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{startLabel}</label>
                <Input
                    type="date"
                    className="w-full"
                    value={startValue}
                    onChange={(e) => onChangeStart(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{endLabel}</label>
                <Input
                    type="date"
                    className="w-full"
                    value={endValue}
                    onChange={(e) => onChangeEnd(e.target.value)}
                />
            </div>
            {/* En móviles: botón ocupa toda la fila; en pantallas grandes se mantiene alineado al final */}
            <div className="flex items-end justify-stretch sm:justify-end">
                <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={onApply}
                >
                    Aplicar filtros
                </Button>
            </div>
        </div>
    );
}