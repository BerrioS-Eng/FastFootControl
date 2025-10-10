import { SaleInProgress } from "@/app/dashboard/sales/types";

const STORAGE_KEY = "salesInProgress";

export const loadSalesInProgress = (): SaleInProgress[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveSaleInProgress = (sale: SaleInProgress) => {
  if (typeof window === "undefined") return;
  if (!sale.concept?.trim()) return;
  const sales = loadSalesInProgress();
  const updatedSales = [...sales.filter((s) => s.id !== sale.id), sale];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
};

export const removeSaleInProgress = (id: string) => {
  if (typeof window === "undefined") return;
  const sales = loadSalesInProgress().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
};