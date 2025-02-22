import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const query = `
        SELECT COUNT(*) AS low_or_out_of_stock
        FROM "ProductSizes"
        WHERE stock = 0 OR (stock > 0 AND stock < 10);
      `;
      const result: { rows: { low_or_out_of_stock: number }[] } = await db.query(query);

      const totalLowOrOutOfStock = result.rows[0]?.low_or_out_of_stock || 0;

      res.status(200).json({ low_or_out_of_stock: totalLowOrOutOfStock });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
