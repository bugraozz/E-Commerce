// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ProductCard } from "@/components/ProductCard";
// import { Loader2 } from "lucide-react";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch("/api/admin/admin-orders");
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (!Array.isArray(data.orders)) {
//         throw new Error("Invalid data format received from server");
//       }
//       console.log("Client: Received orders:", data.orders);

//       const now = new Date();
//       const filteredOrders = data.orders.map(order => {
//         const orderDate = new Date(order.created_at);
//         const isRecent = (now.getTime() - orderDate.getTime()) <= 24 * 60 * 60 * 1000;
//         return {
//           ...order,
//           isRecent,
//           total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
//         };
//       });

//       setOrders(filteredOrders);
//     } catch (error) {
//       console.error("Client: Error fetching orders:", error);
//       setError("Failed to load orders. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOrderClick = (order: any) => {
//     console.log("Selected order:", order);
//     setSelectedOrder(order);
//   };

//   const handleViewProduct = async (productId: number) => {
//     try {
//       const response = await fetch(`/api/products/${productId}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const product = await response.json();
//       setSelectedProduct(product);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       // You might want to show an error message to the user here
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Admin Orders</h1>
//       {orders.length === 0 ? (
//         <p className="text-center text-gray-500">No orders found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {orders.map((order) => (
//             <Card
//               key={order.order_id}
//               className="cursor-pointer hover:shadow-lg transition-shadow"
//               onClick={() => order.isRecent && handleOrderClick(order)}
//             >
//               <CardHeader>
//                 <CardTitle>Order #{order.order_id}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600 mb-2">Date: {new Date(order.created_at).toLocaleDateString("en-US")}</p>
//                 {order.isRecent ? (
//                   <>
//                     <p className="text-sm text-gray-600 mb-2">Items: {order.items.length}</p>
//                     <p className="text-sm text-gray-600">
//                       Total: ₺{order.total}
//                     </p>
//                   </>
//                 ) : (
//                   <p className="text-sm text-gray-600">
//                     Total: ₺{order.total}
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {selectedOrder && selectedOrder.isRecent && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
//             <h3 className="text-2xl font-semibold mb-4">Order #{selectedOrder.order_id}</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Date: {new Date(selectedOrder.created_at).toLocaleDateString("en-US")}
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {selectedOrder.items.map((item: any, idx: number) => (
//                 <div key={idx} className="border rounded-lg p-4 flex items-center space-x-4">
//                   <div className="flex-shrink-0">
//                     <Image
//                       src={item.image || "/placeholder.svg"}
//                       alt={`Product ${item.name}`}
//                       width={80}
//                       height={80}
//                       className="rounded-md object-cover"
//                     />
//                   </div>
//                   <div className="flex-grow">
//                     <p className="font-semibold">{item.name}</p>
//                     <p className="text-sm text-gray-600">Product ID: {item.product_id}</p>
//                     <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                     <p className="text-sm text-gray-600">Price: ₺{item.price}</p>
//                     <Button
//                       variant="link"
//                       className="p-0 h-auto font-normal text-blue-500 hover:text-blue-700"
//                       onClick={() => handleViewProduct(item.product_id)}
//                     >
//                       View Product
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <Button className="mt-6" onClick={() => setSelectedOrder(null)}>
//               Close
//             </Button>
//           </div>
//         </div>
//       )}

//       {selectedProduct && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <ProductCard product={selectedProduct} />
//             <Button className="mt-4 w-full" onClick={() => setSelectedProduct(null)}>
//               Close
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// AdminOrdersPage.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext ";

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { orders, setOrders, markOrderAsSeen } = useNotification();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/admin-orders");
        const data = await response.json();
        setOrders(data.orders);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders]);

  const handleOrderClick = (order: any) => {
    console.log("Selected order:", order);
    setSelectedOrder(order);
  };

  const handleViewProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const product = await response.json();
      setSelectedProduct(product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Siparişler</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Henüz sipariş bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card
              key={order.order_id}
              className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => handleOrderClick(order)}
            >
              <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Sipariş #{order.order_id}
                  </CardTitle>
                  <input
                    type="checkbox"
                    checked={order.is_seen}
                    onChange={(e) => {
                      e.stopPropagation(); // Card'a tıklanmasını engelle
                      markOrderAsSeen(order.order_id);
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tarih:</span>{" "}
                    {new Date(order.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Toplam:</span> ₺
                    {order.items
                      .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ürün Sayısı:</span> {order.items.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Sipariş #{selectedOrder.order_id}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Tarih:</span>{" "}
              {new Date(selectedOrder.created_at).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Kullanıcı Bilgileri */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Kullanıcı Bilgileri</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ad:</span> {selectedOrder.user.Username}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {selectedOrder.user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Telefon:</span> {selectedOrder.user.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Adres:</span> {selectedOrder.user.address}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Şehir:</span> {selectedOrder.user.city}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ülke:</span> {selectedOrder.user.country}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Posta Kodu:</span> {selectedOrder.user.zipcode}
                </p>
              </div>
            </div>

            {/* Ürün Listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedOrder.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={`Product ${item.name}`}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Ürün ID: {item.product_id}</p>
                    <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Fiyat: ₺{item.price}</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewProduct(item.product_id)}
                    >
                      Ürünü Görüntüle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-6" onClick={() => setSelectedOrder(null)}>
              Kapat
            </Button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <ProductCard product={selectedProduct} />
            <Button className="mt-4 w-full" onClick={() => setSelectedProduct(null)}>
              Kapat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}