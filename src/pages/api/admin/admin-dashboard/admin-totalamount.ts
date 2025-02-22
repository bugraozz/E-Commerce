import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
      try {
        console.log("API: Fetching total amount...");
        
        // Sorguyu logla
        const query = "SELECT SUM(total_amount) AS total_revenue FROM orders WHERE status = 'completed'";
        console.log("API: Query:", query);
        
        // Sorguyu çalıştır
        const result = await db.query(query);
        console.log("API: Query result:", result);
        
        // Sorgu sonucunu logla
        console.log("API: Rows returned:", result.rows);
        
        const total_amount = result.rows[0]?.total_revenue || 0;
        console.log("API: Total revenue calculated:", total_amount);
  
        res.status(200).json({ total_amount });
      } catch (error) {
        console.error("API: Database error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
  
