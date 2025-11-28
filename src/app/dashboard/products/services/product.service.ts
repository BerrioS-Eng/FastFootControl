import { ProductsAPI } from "@/app/dashboard/products/api/products";
import type { Product, CostItem } from "../types";
import { fromDTO, toCreateRequest, toEditRequest } from "../mappers/products.mapper";
import { ProductSaleTableDTO } from "@/app/dashboard/products/types/dto";

export const ProductService = {
    async list(): Promise<Product[]> {
        const dtos = await ProductsAPI.getAll();
        return dtos.map(fromDTO);
    },
    async get(id: number): Promise<Product> {
        const dto = await ProductsAPI.getById(id);
        return fromDTO(dto);
    },
    async create(
        input: {
            name: string;
            ingredients: CostItem[];
            directCosts: CostItem[];
            labour: number;
            profitMargin: number;
        },
        imageFile: File,
    ): Promise<Product> {
        const dto = await ProductsAPI.create(toCreateRequest(input), imageFile);
        return fromDTO(dto);
    },
    async edit(
        id: number,
        input: Partial<{
            name: string;
            ingredients: CostItem[];
            directCosts: CostItem[];
            labour: number;
            profitMargin: number;
            netPrice: number; // ⬅️ añadimos netPrice también aquí
        }>,
    ): Promise<Product> {
        const dto = await ProductsAPI.edit(id, toEditRequest(input));
        return fromDTO(dto);
    },
    async remove(id: number): Promise<string> {
        return ProductsAPI.remove(id);
    },
    async listForSale(): Promise<
        Array<{ id: string; product: string; salePrice: number }>
    > {
        const dtos: ProductSaleTableDTO[] = await ProductsAPI.getSaleTable();
        return dtos.map((d) => ({
            id: String(d.productId),
            product: d.productName,
            salePrice: d.salePrice,
        }));
    },
};