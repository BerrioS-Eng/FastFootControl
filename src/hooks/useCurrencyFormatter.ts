import { useMemo } from 'react';

export const useCurrencyFormatter = (
    locale: string = 'es-CO',
    currency = 'COP',
    minimumFractionDigits = 2
) => {
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits,
            }),
        [locale, currency, minimumFractionDigits]
    );

    const format = (value: number | null | undefined) =>
        value == null || Number.isNaN(value) ? '—' : formatter.format(value);

    return { format, formatter };
};