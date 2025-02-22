import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
        console.log("API: Fetching total products...")
        const query = `SELECT COUNT(*) AS total_products FROM "Products" `;
     
        const result = await db.query(query)
        
        const total_products = result.rows[0]?.total_products || 0;
    
        
        res.status(200).json({ total_products })
        } catch (error) {
        console.error("API: Database error:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
        }
    } else {
        res.status(405).json({ message: "Method not allowed" })
}