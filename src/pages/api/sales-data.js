import db from '@/lib/db';

export default async function handler(req, res) {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];
    

    const client = await db.query(`
      SELECT p.name AS productName, SUM(oi.quantity) AS salesCount
      FROM order_items oi
      JOIN "Products" p ON oi.product_id = p.id
      GROUP BY p.name
      ORDER BY salesCount DESC
    `);

    res.status(200).json(client.rows);
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
    res.status(500).json({ message: 'Failed to fetch sales data' });
  }
}
