import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartContextType {
  cart: any[];
  clearCart: () => void;
}



export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState([]);
  const CartContext = createContext<CartContextType | null>(null);
  const clearCart = useCallback(() => {
    setCart([]);
  }, []); 

  return (
    <CartContext.Provider value={{ cart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
