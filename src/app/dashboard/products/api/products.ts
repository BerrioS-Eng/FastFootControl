import { http } from '@/lib/api/http';
import type {
    ProductDTO,
    ProductCreateRequest,
    ProductEditRequest,
    ProductSaleTableDTO
} from '@/app/dashboard/products/types/dto';

export const ProductsAPI = {
    // TODOS los productos (público en cuanto a rol)
    getAll: () => http<ProductDTO[]>("", "/api/products/all"),

    // Detalle por id (ADMIN/WORKER)
    getById: (productId: number) => http<ProductDTO>("", `/api/products/${productId}`),

    // Crear con imagen (ADMIN/WORKER)
    create: (payload: ProductCreateRequest, imageFile: File) => {
        const fd = new FormData();
        fd.append('request', JSON.stringify(payload));
        fd.append('image', imageFile);
        return fetch(`/api/products`, { method: 'POST', body: fd, cache: 'no-store' })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error((data as any)?.message ?? `HTTP ${res.status}`);
                return data as ProductDTO;
            });
    },

    // Editar (solo ADMIN)
    edit: (productId: number, payload: ProductEditRequest) =>
        http<ProductDTO>("", `/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    // Eliminar (solo ADMIN)
    remove: (productId: number) =>
        http<string>("", `/api/products/${productId}`, { method: 'DELETE' }),

    // Para la tabla de venta (ADMIN/WORKER)
    getSaleTable: () => http<ProductSaleTableDTO[]>("", `/api/products/for-sale`),
};