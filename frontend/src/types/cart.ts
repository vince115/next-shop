//frontend/src/types/cart.ts
export interface CartItem {
  id: number;
  product: {
    id: number
    name: string
    imageUrl: string
    price: number
  }
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
