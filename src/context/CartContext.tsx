import { createContext, useContext, useState, useCallback } from 'react';

// ...existing code...

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

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
