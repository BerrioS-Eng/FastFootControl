// Sales Service
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { SaleDTO, SaleRequest } from '@/types/api';

export class SalesService {
  static async registerSale(saleData: SaleRequest): Promise<SaleDTO> {
    try {
      return await apiClient.post<SaleDTO>(
        API_ENDPOINTS.SALES,
        saleData
      );
    } catch (error) {
      console.error('Failed to register sale:', error);
      throw new Error('Failed to register sale. Please try again.');
    }
  }

  static async getSaleById(saleId: number): Promise<SaleDTO> {
    try {
      return await apiClient.get<SaleDTO>(
        `${API_ENDPOINTS.SALES}?saleId=${saleId}`
      );
    } catch (error) {
      console.error('Failed to fetch sale:', error);
      throw new Error('Failed to fetch sale. Please try again.');
    }
  }

  static async getAllSales(): Promise<SaleDTO[]> {
    try {
      return await apiClient.get<SaleDTO[]>(API_ENDPOINTS.SALES);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      throw new Error('Failed to fetch sales. Please try again.');
    }
  }

  static async getSalesByDay(date: string): Promise<SaleDTO[]> {
    try {
      return await apiClient.get<SaleDTO[]>(
        `${API_ENDPOINTS.SALES}?date=${date}`
      );
    } catch (error) {
      console.error('Failed to fetch sales by day:', error);
      throw new Error('Failed to fetch sales by day. Please try again.');
    }
  }

  static async deleteSale(saleId: number): Promise<string> {
    try {
      return await apiClient.delete<string>(
        `${API_ENDPOINTS.SALES}?saleId=${saleId}`
      );
    } catch (error) {
      console.error('Failed to delete sale:', error);
      throw new Error('Failed to delete sale. Please try again.');
    }
  }
}