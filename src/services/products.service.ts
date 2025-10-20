// Products Service
import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import { ProductDTO, ProductRequest } from '@/types/api';

export class ProductsService {
  static async createProduct(productData: ProductRequest): Promise<ProductDTO> {
    try {
      const formData = new FormData();
      
      // Create the request object without the image
      const { image, ...requestData } = productData;
      formData.append('request', JSON.stringify(requestData));
      
      // Add the image file if provided
      if (image) {
        formData.append('image', image);
      }
      
      return await apiClient.postFormData<ProductDTO>(
        API_ENDPOINTS.PRODUCTS,
        formData
      );
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error('Failed to create product. Please try again.');
    }
  }

  static async editProduct(productId: number, editData: Partial<ProductDTO>): Promise<ProductDTO> {
    try {
      return await apiClient.put<ProductDTO>(
        `${API_ENDPOINTS.PRODUCTS}?productId=${productId}`,
        editData
      );
    } catch (error) {
      console.error('Failed to edit product:', error);
      throw new Error('Failed to edit product. Please try again.');
    }
  }

  static async getAllProducts(): Promise<ProductDTO[]> {
    try {
      return await apiClient.get<ProductDTO[]>(API_ENDPOINTS.PRODUCTS);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products. Please try again.');
    }
  }

  static async getProductById(productId: number): Promise<ProductDTO> {
    try {
      return await apiClient.get<ProductDTO>(
        `${API_ENDPOINTS.PRODUCTS}?productId=${productId}`
      );
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw new Error('Failed to fetch product. Please try again.');
    }
  }

  static async deleteProduct(productId: number): Promise<string> {
    try {
      return await apiClient.delete<string>(
        `${API_ENDPOINTS.PRODUCTS}?productId=${productId}`
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error('Failed to delete product. Please try again.');
    }
  }
}