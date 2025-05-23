import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CartItem, Product, InsertCartItem } from "@shared/schema";

interface CartContextType {
  cartItems: (CartItem & { product: Product })[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (item: Omit<InsertCartItem, "sessionId">) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Generate or retrieve session ID
    let storedSessionId = localStorage.getItem("cart-session-id");
    if (!storedSessionId) {
      storedSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart-session-id", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const { data: cartItems = [], isLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !!sessionId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "sessionId">) => {
      return apiRequest("POST", "/api/cart", { ...item, sessionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/cart/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  const value: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart: addToCartMutation.mutateAsync,
    updateQuantity: (itemId, quantity) => updateQuantityMutation.mutateAsync({ itemId, quantity }),
    removeFromCart: removeFromCartMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
