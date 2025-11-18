import { SaleInProgress } from '../types';

const SALES_KEY = 'sales_in_progress';

export const loadSalesInProgress = (): SaleInProgress[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(SALES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading sales from localStorage:', error);
    return [];
  }
};

export const saveSaleInProgress = (sale: SaleInProgress): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const sales = loadSalesInProgress();
    const existingIndex = sales.findIndex(s => s.id === sale.id);
    
    if (existingIndex >= 0) {
      sales[existingIndex] = sale;
    } else {
      sales.push(sale);
    }
    
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sale to localStorage:', error);
  }
};

export const removeSaleInProgress = (saleId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const sales = loadSalesInProgress();
    const filteredSales = sales.filter(s => s.id !== saleId);
    localStorage.setItem(SALES_KEY, JSON.stringify(filteredSales));
  } catch (error) {
    console.error('Error removing sale from localStorage:', error);
  }
};

export const clearSalesInProgress = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SALES_KEY);
  } catch (error) {
    console.error('Error clearing sales from localStorage:', error);
  }
};