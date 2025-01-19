import db from '@/lib/db';

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];

    // Fiyat toplamına göre veri sorguluyoruz
    const client = await db.query(`
      SELECT 
        DATE_TRUNC('day', o.created_at) AS date, 
        SUM(oi.price * oi.quantity) AS totalSales 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id        
      WHERE o.created_at >= NOW() - INTERVAL '1 month' 
      GROUP BY date                             
      ORDER BY date                            
    `);

    res.status(200).json(client.rows); // Veriyi JSON formatında döndürüyoruz
  } catch (error) {
    console.error('Failed to fetch daily sales data:', error);
    res.status(500).json({ message: 'Failed to fetch daily sales data' });
  }
}
