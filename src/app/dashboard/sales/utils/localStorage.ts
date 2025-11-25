import {SaleInProgress} from "@/app/dashboard/sales/types";

const STORAGE_KEY = "salesInProgress";

export const loadSalesInProgress  = (): SaleInProgress[] => {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export const hasMeaningfulData = (s: SaleInProgress) => {
    const hasConcept = !!s.concept?.trim();
    const hasPay = !!s.paymentMethod?.trim();
    const hasTotal = !!s.totalPrice && s.totalPrice > 0;
    const hasProducts = !!s.products?.length;
    return hasConcept || hasPay || hasTotal || hasProducts;
};

export const saveSaleInProgress = (sale: SaleInProgress) => {
    if (typeof window === "undefined") return;
    if (!hasMeaningfulData(sale)) return; // ahora coherente con el flujo
    const sales = loadSalesInProgress();
    const updated = [...sales.filter(s => s.id !== sale.id), sale];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('route.ts-in-progress:changed'));
};

export const removeSaleInProgress = (id: string) => {
    if (typeof window === "undefined") return;
    const sales = loadSalesInProgress().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
    window.dispatchEvent(new Event('route.ts-in-progress:changed'));
};