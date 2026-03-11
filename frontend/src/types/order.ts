//frontend/src/types/order.ts
import { ProductSummary } from "./product";

export interface OrderItem {
    id: number;

    product: ProductSummary;

    quantity: number;

    price: number;

    subtotal: number;
}

export interface Order {
    id: number;

    items: OrderItem[];

    totalItems: number;

    totalPrice: number;

    status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

    createdAt: string;

    updatedAt: string;
}