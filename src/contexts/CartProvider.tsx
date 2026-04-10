import { useState, ReactNode, useCallback } from "react";
import { CartContext, CartItem, CartContextType } from "./CartContext";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (
      adId: string,
      title: string,
      price: number,
      image: string,
      seller: string,
      quantity: number = 1,
    ) => {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.adId === adId);

        if (existingItem) {
          // Si l'article existe déjà, augmenter la quantité
          return prev.map((item) =>
            item.adId === adId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        // Sinon, ajouter le nouvel article
        const newItem: CartItem = {
          id: Date.now().toString(),
          adId,
          title,
          price,
          image,
          seller,
          quantity,
          addedAt: new Date(),
        };

        return [...prev, newItem];
      });
    },
    [],
  );

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const checkout = useCallback(() => {
    console.log("Checkout with items:", cartItems);
    // Logique de paiement - à implémenter avec Stripe/PayPal
    clearCart();
  }, [cartItems, clearCart]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    cartItems,
    totalPrice,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
