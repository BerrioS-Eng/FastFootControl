import {http, httpMultipart} from '@/lib/api/http';
import type {
    ProductDTO,
    ProductCreateRequest,
    ProductEditRequest,
    ProductSaleTableDTO
} from '@/app/dashboard/products/types/dto';
import {ENDPOINTS} from "@/lib/config";

export const ProductsAPI = {
    getAll: () => http<ProductDTO[]>(ENDPOINTS.products, `/get-all-products`),
    getById: (productId: number) => http<ProductDTO>(ENDPOINTS.products, `/get-product?productId=${productId}`),
    create: (payload: ProductCreateRequest, imageFile: File) => {
        const fd = new FormData();
        fd.append('request', JSON.stringify(payload));
        fd.append('image', imageFile);
        return httpMultipart<ProductDTO>('/create-product', fd);
    },
    edit: (productId: number, payload: ProductEditRequest) =>
        http<ProductDTO>(ENDPOINTS.products, `/edit-product?productId=${productId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
    remove: (productId: number) =>
        http<string>(ENDPOINTS.products, `/delete-product?productId=${productId}`, {method: 'DELETE'}),
    getSaleTable: () => http<ProductSaleTableDTO[]>(ENDPOINTS.products, `/get-products-for-sale-table`),
};