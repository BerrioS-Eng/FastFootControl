import { SaleInProgress } from "@/app/dashboard/sales/types";

export const loadSalesInProgress = (): SaleInProgress[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('salesInProgress');
  return saved ? JSON.parse(saved) : [];
};

export const saveSaleInProgress = (sale: SaleInProgress) => {
  const sales = loadSalesInProgress();
  const updatedSales = sales.filter((s) => s.id !== sale.id).concat(sale);
  localStorage.setItem('salesInProgress', JSON.stringify(updatedSales));
};

export const removeSaleInProgress = (id: string) => {
  const sales = loadSalesInProgress();
  const updatedSales = sales.filter((s) => s.id !== id);
  localStorage.setItem('salesInProgress', JSON.stringify(updatedSales));
};