"use client";
import * as React from "react";

interface UseDateRangeFilterOptions {
    defaultStart: string;
    defaultEnd: string;
}

export function useDateRangeFilter({defaultStart, defaultEnd}: UseDateRangeFilterOptions) {
    // valores que se editan en los inputs
    const [startInput, setStartInput] = React.useState(defaultStart);
    const [endInput, setEndInput] = React.useState(defaultEnd);

    // valores realmente aplicados (los que usan los hooks de datos)
    const [start, setStart] = React.useState(defaultStart);
    const [end, setEnd] = React.useState(defaultEnd);

    const apply = React.useCallback(() => {
        setStart(startInput);
        setEnd(endInput);
    }, [startInput, endInput]);

    return {
        // inputs
        startInput,
        endInput,
        setStartInput,
        setEndInput,
        // aplicados
        start,
        end,
        // acción
        apply,
    };
}