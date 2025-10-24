import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (
    value: number | null | undefined,
    locale: string = 'es-CO',
    currency = 'COP',
    minimumFractionDigits = 2
): string => {
    if (value == null || Number.isNaN(value)) return '—';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
    }).format(value);
};