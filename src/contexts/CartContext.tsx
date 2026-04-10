import { createContext } from "react";

export interface CartItem {
  id: string;
  adId: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
  addedAt: Date;
}

export interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  addToCart: (
    adId: string,
    title: string,
    price: number,
    image: string,
    seller: string,
    quantity?: number,
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
