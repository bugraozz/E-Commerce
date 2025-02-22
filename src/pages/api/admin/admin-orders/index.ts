// import type { NextApiRequest, NextApiResponse } from "next"
// import db from "../../../../lib/db"

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     try {
//       console.log("API: Fetching orders and order items...")
//       const ordersQuery = `
//         SELECT o.id as order_id, o.created_at, oi.product_id, oi.quantity, oi.price, p.image, p.name
//         FROM orders o
//         LEFT JOIN order_items oi ON o.id = oi.order_id
//         LEFT JOIN "Products" p ON oi.product_id = p.id
//         WHERE o.created_at >= NOW() - INTERVAL '24 HOURS'
//         ORDER BY o.created_at DESC
//       `
//       const result = await db.query(ordersQuery)
//       const orders = result.rows

//       if (!Array.isArray(orders)) {
//         throw new Error("Invalid data format received from database")
//       }

//       const ordersById = orders.reduce((acc: Record<string, any>, order: any) => {
//         const orderId = order.order_id
//         if (!acc[orderId]) {
//           acc[orderId] = {
//             order_id: orderId,
//             created_at: order.created_at,
//             items: [],
//           }
//         }
//         acc[orderId].items.push({
//           product_id: order.product_id,
//           name: order.name,
//           quantity: order.quantity,
//           price: order.price,
//           image: order.image,
//         })
//         return acc
//       }, {})

//       const formattedOrders = Object.values(ordersById)

//       console.log("API: Formatted orders:", JSON.stringify(formattedOrders, null, 2))

//       res.status(200).json({ orders: formattedOrders })
//     } catch (error) {
//       console.error("API: Database error:", error)
//       const errorMessage = error instanceof Error ? error.message : "Unknown error"
//       res.status(500).json({ message: "Internal Server Error", error: errorMessage })
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" })
//   }
// }



// index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      console.log("API: Fetching orders and order items...");
      const ordersQuery = `
        SELECT 
          o.id as order_id, 
          o.created_at, 
          o.is_seen, 
          o.user_id, 
          u."Username" as user_name, 
          u.email as user_email, 
          u.phone as user_phone, 
          u.adress as user_address, 
          u.city as user_city, 
          u.country as user_country, 
          u.zipcode as user_zipcode, 
          oi.product_id, 
          oi.quantity, 
          oi.price, 
          p.image, 
          p.name
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN "Products" p ON oi.product_id = p.id
        LEFT JOIN "Users" u ON o.user_id = u.id
        WHERE o.created_at >= NOW() - INTERVAL '24 HOURS'
        ORDER BY o.created_at DESC
      `;
      const result = await db.query(ordersQuery);
      const orders = result.rows;

      if (!Array.isArray(orders)) {
        throw new Error("Invalid data format received from database");
      }

      const ordersById = orders.reduce((acc: Record<string, any>, order: any) => {
        const orderId = order.order_id;
        if (!acc[orderId]) {
          acc[orderId] = {
            order_id: orderId,
            created_at: order.created_at,
            is_seen: order.is_seen,
            user: {
              id: order.user_id,
              Username: order.user_name,
              email: order.user_email,
              phone: order.user_phone,
              address: order.user_address,
              city: order.user_city,
              country: order.user_country,
              zipcode: order.user_zipcode,
            },
            items: [],
          };
        }
        acc[orderId].items.push({
          product_id: order.product_id,
          name: order.name,
          quantity: order.quantity,
          price: order.price,
          image: order.image,
        });
        return acc;
      }, {});

      const formattedOrders = Object.values(ordersById);

      console.log("API: Formatted orders:", JSON.stringify(formattedOrders, null, 2));

      res.status(200).json({ orders: formattedOrders });
    } catch (error) {
      console.error("API: Database error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
  } else if (req.method === "POST") {
    try {
      const { orderId } = req.body;

      // Siparişin is_seen durumunu güncelle
      const updateQuery = `
        UPDATE orders
        SET is_seen = TRUE
        WHERE id = $1
      `;
      await db.query(updateQuery, [orderId]);

      res.status(200).json({ message: "Order marked as seen" });
    } catch (error) {
      console.error("API: Error updating order status:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}