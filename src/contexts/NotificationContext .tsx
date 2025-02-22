// contexts/NotificationContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface Order {
  order_id: number;
  created_at: string;
  is_seen: boolean;
  items?: any[]; // Sipariş öğeleri için opsiyonel alan
}

interface NotificationContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  markOrderAsSeen: (orderId: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  orders: [],
  setOrders: () => {},
  markOrderAsSeen: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const markOrderAsSeen = async (orderId: number) => {
    try {
      // API'ye istek göndererek veritabanını güncelle
      await fetch("/api/admin/admin-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      // State'i güncelle
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, is_seen: true } : order
        )
      );
    } catch (error) {
      console.error("Error marking order as seen:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ orders, setOrders, markOrderAsSeen }}>
      {children}
    </NotificationContext.Provider>
  );
};