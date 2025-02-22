// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FaUser, FaTshirt, FaFileAlt, FaSquare, FaChartBar, FaSignOutAlt, FaJediOrder, FaArchive } from "react-icons/fa";
// import {  UserCheck, User, Users, Package,DollarSign ,ShoppingCart,FileText  } from "lucide-react";
// import { usePathname } from "next/navigation";

// export default function AdminPage() {
//   const { logout } = useAuth();
//   const [totalUsers, setTotalUsers] = useState<number | null>(null);
//   const [totalProducts, setTotalProducts] = useState<number | null>(null);
//   const [totalAmount, setTotalAmount] = useState<number | null>(null);
//   const [outOfStock, setOutOfStock] = useState<number | null>(null);
//   const [lowStock, setLowStock] = useState<number | null>(null);
//   const [visitorCount, setVisitorCount] = useState<number | null>(null);
//   const [activeVisitors, setActiveVisitors] = useState(0)
//   const [lowOrOutOfStock, setLowOrOutOfStock] = useState<number | null>(null);
//   const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
//   const pathname = usePathname();

//   useEffect(() => {
//     const fetchTotalUsers = async () => {
//       try {
//         const response = await fetch("/api/admin/admin-dashboard");
//         const data = await response.json();
//         setTotalUsers(data.total_users);
//       } catch (error) {
//         console.error("Client: Error fetching total users:", error);
//       }
//     };

//     const fetchTotalProducts = async () => {
//       try {
//         const response = await fetch("/api/admin/admin-dashboard/admin-product");
//         const data = await response.json();
//         setTotalProducts(data.total_products);
//       } catch (error) {
//         console.error("Client: Error fetching total products:", error);
//       }
//     };

//     const fetchTotalAmount = async () => {
//       try {
//         const response = await fetch("/api/admin/admin-dashboard/admin-totalamount");
//         const data = await response.json();
//         setTotalAmount(data.total_amount);
//       } catch (error) {
//         console.error("Client: Error fetching total amount:", error);
//       }
//     };

//     const fetchLowOrOutOfStock = async () => {
//       try {
//         const response = await fetch("/api/admin/admin-dashboard/stock-warnings");
//         const data = await response.json();
//         setLowOrOutOfStock(data.low_or_out_of_stock || 0);
//       } catch (error) {
//         console.error("Error fetching stock warnings:", error);
//       }
//     };

//     const fetchVisitorCount = async () => {
//       try {
//         const response = await fetch("/api/admin/admin-dashboard/admin-visitor-count");
//         const data = await response.json();
//         setVisitorCount(data.totalVisitors);
//       } catch (error) {
//         console.error("Error fetching visitor count:", error);
//       }
//     };

//     const fetchNewOrdersCount = async () => {
//       try {
//         const response = await fetch("/api/admin/admin-orders");
//         const data = await response.json();
//         const now = new Date();
//         const newOrders = data.orders.filter((order: any) => {
//           const orderDate = new Date(order.created_at);
//           return (now.getTime() - orderDate.getTime()) <= 24 * 60 * 60 * 1000;
//         });
//         setNewOrdersCount(newOrders.length);
//       } catch (error) {
//         console.error("Error fetching new orders count:", error);
//       }
//     };

//     fetchVisitorCount();
//     fetchLowOrOutOfStock();
//     fetchTotalAmount();
//     fetchTotalProducts();
//     fetchTotalUsers();
//     fetchNewOrdersCount();
//   }, []);

//   useEffect(() => {
//     if (pathname === "/admin/orders") {
//       setNewOrdersCount(0);
//     }
//   }, [pathname]);

//   const statistics = [
//     {
//       title: "Toplam Kullanıcı",
//       value: totalUsers !== null ? totalUsers : "Yükleniyor...",
//       icon: FaUser,
//       color: "bg-blue-500",
//     },
//     {
//       title: "Toplam Ziyaretçi",
//       value: visitorCount,
//       icon: FaJediOrder,
//       color: "bg-purple-500",
//     },
    
//     {
//       title: "Toplam Ürün",
//       value: totalProducts !== null ? totalProducts : "Yükleniyor...",
//       icon: FaTshirt,
//       color: "bg-green-500",
//     },
//     {
//       title: "Toplam Satış",
//       value: totalAmount !== null ? `₺${totalAmount}` : "Yükleniyor...",
//       icon: FaChartBar,
//       color: "bg-yellow-500",
//     },
//     {
//       title: "Stok Uyarısı",
//       value: lowOrOutOfStock !== null ? lowOrOutOfStock : "Yükleniyor...",
//       icon: FaSquare,
//       color: "bg-red-500",
//     },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
//         </div>
//         <nav className="mt-6">
//           {[
//             { name: "Kadın Ürünleri", href: "/admin/women", icon: UserCheck },
//             { name: "Erkek Ürünleri", href: "/admin/men", icon: User },
//             { name: "Kullanıcılar", href: "/admin/users", icon: Users },
//             { name: "Sayfalar", href: "/admin/content-pages", icon: FileText },
//             { name: "Ürün Stokları", href: "/admin/products-stock", icon: Package  },
//             { name: "Satışlar", href: "/admin/sales-dashboard", icon: DollarSign },
//             { name: "siparişler", href: "/admin/orders", icon: ShoppingCart, notification: newOrdersCount > 0 },
//           ].map((item) => (
//             <Link key={item.name} href={item.href}>
//               <span className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer relative">
//                 <item.icon className="mr-3" />
//                 {item.name}
//                 {item.notification && (
//                   <span className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {newOrdersCount}
//                   </span>
//                 )}
//               </span>
//             </Link>
//           ))}
//         </nav>
//         <div className="absolute bottom-0 w-64 p-4">
//           <Button onClick={logout} className="w-full bg-red-500 text-white hover:bg-red-600">
//             <FaSignOutAlt className="mr-2" /> Çıkış Yap
//           </Button>
//           <Button className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
//             <Link href="/">Siteye Dön</Link>
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//         <div className="container mx-auto px-6 py-8">
//           <h2 className="text-3xl font-semibold text-gray-800 mb-6">Genel Bakış</h2>

//           {/* Statistics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {statistics.map((stat, index) => (
//               <Card key={index}>
//                 <CardContent className="flex items-center p-6">
//                   <div className={`rounded-full p-3 ${stat.color}`}>
//                     <stat.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="ml-4">
//                     <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
//                     <p className="text-2xl font-semibold text-gray-800">
//                       {typeof stat.value === "number" ? stat.value.toString() : stat.value}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Recent Activity */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Son Aktiviteler</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="divide-y divide-gray-200">
//                 {[
//                   { action: "Yeni kullanıcı kaydoldu", user: "Ahmet Y.", time: "5 dakika önce" },
//                   { action: "Yeni sipariş alındı", user: "Ayşe K.", time: "23 dakika önce" },
//                   { action: "Ürün stoku güncellendi", user: "Mehmet A.", time: "1 saat önce" },
//                   { action: "Yeni yorum eklendi", user: "Zeynep B.", time: "2 saat önce" },
//                 ].map((activity, index) => (
//                   <li key={index} className="py-3">
//                     <p className="text-sm font-medium text-gray-900">{activity.action}</p>
//                     <p className="text-sm text-gray-500">
//                       {activity.user} - {activity.time}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }



// AdminPage.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUser, FaTshirt, FaFileAlt, FaSquare, FaChartBar, FaSignOutAlt, FaJediOrder } from "react-icons/fa";
import { UserCheck, User, Users, Package, DollarSign, ShoppingCart, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext ";

export default function AdminPage() {
  const { logout } = useAuth();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [outOfStock, setOutOfStock] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [lowOrOutOfStock, setLowOrOutOfStock] = useState<number | null>(null);
  const pathname = usePathname();
  const { orders } = useNotification();

  // Görülmemiş siparişlerin sayısını hesapla
  const newOrdersCount = orders.filter((order) => !order.is_seen).length;

  console.log("AdminPage: Rendering with newOrdersCount:", newOrdersCount);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard");
        const data = await response.json();
        setTotalUsers(data.total_users);
      } catch (error) {
        console.error("Client: Error fetching total users:", error);
      }
    };

    const fetchTotalProducts = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/admin-product");
        const data = await response.json();
        setTotalProducts(data.total_products);
      } catch (error) {
        console.error("Client: Error fetching total products:", error);
      }
    };

    const fetchTotalAmount = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/admin-totalamount");
        const data = await response.json();
        setTotalAmount(data.total_amount);
      } catch (error) {
        console.error("Client: Error fetching total amount:", error);
      }
    };

    const fetchLowOrOutOfStock = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/stock-warnings");
        const data = await response.json();
        setLowOrOutOfStock(data.low_or_out_of_stock || 0);
      } catch (error) {
        console.error("Error fetching stock warnings:", error);
      }
    };

    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard/admin-visitor-count");
        const data = await response.json();
        setVisitorCount(data.totalVisitors);
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount();
    fetchLowOrOutOfStock();
    fetchTotalAmount();
    fetchTotalProducts();
    fetchTotalUsers();
  }, []);

  const statistics = [
    {
      title: "Toplam Kullanıcı",
      value: totalUsers !== null ? totalUsers : "Yükleniyor...",
      icon: FaUser,
      color: "bg-blue-500",
    },
    {
      title: "Toplam Ziyaretçi",
      value: visitorCount,
      icon: FaJediOrder,
      color: "bg-purple-500",
    },
    {
      title: "Toplam Ürün",
      value: totalProducts !== null ? totalProducts : "Yükleniyor...",
      icon: FaTshirt,
      color: "bg-green-500",
    },
    {
      title: "Toplam Satış",
      value: totalAmount !== null ? `₺${totalAmount}` : "Yükleniyor...",
      icon: FaChartBar,
      color: "bg-yellow-500",
    },
    {
      title: "Stok Uyarısı",
      value: lowOrOutOfStock !== null ? lowOrOutOfStock : "Yükleniyor...",
      icon: FaSquare,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {[
            { name: "Kadın Ürünleri", href: "/admin/women", icon: UserCheck },
            { name: "Erkek Ürünleri", href: "/admin/men", icon: User },
            { name: "Kullanıcılar", href: "/admin/users", icon: Users },
            { name: "Sayfalar", href: "/admin/content-pages", icon: FileText },
            { name: "Ürün Stokları", href: "/admin/products-stock", icon: Package },
            { name: "Satışlar", href: "/admin/sales-dashboard", icon: DollarSign },
            { name: "siparişler", href: "/admin/orders", icon: ShoppingCart, notification: newOrdersCount > 0 },
          ].map((item) => (
            <Link key={item.name} href={item.href}>
              <span className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer relative">
                <item.icon className="mr-3" />
                {item.name}
                {item.notification && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {newOrdersCount}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button onClick={logout} className="w-full bg-red-500 text-white hover:bg-red-600">
            <FaSignOutAlt className="mr-2" /> Çıkış Yap
          </Button>
          <Button className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
            <Link href="/">Siteye Dön</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Genel Bakış</h2>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statistics.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center p-6">
                  <div className={`rounded-full p-3 ${stat.color}`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                    <p className="text-2xl font-semibold text-gray-800">
                      {typeof stat.value === "number" ? stat.value.toString() : stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {[
                  { action: "Yeni kullanıcı kaydoldu", user: "Ahmet Y.", time: "5 dakika önce" },
                  { action: "Yeni sipariş alındı", user: "Ayşe K.", time: "23 dakika önce" },
                  { action: "Ürün stoku güncellendi", user: "Mehmet A.", time: "1 saat önce" },
                  { action: "Yeni yorum eklendi", user: "Zeynep B.", time: "2 saat önce" },
                ].map((activity, index) => (
                  <li key={index} className="py-3">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {activity.user} - {activity.time}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}