import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth } from '@/lib/auth'; // Token doğrulama için verifyAuth
import pool from '@/lib/db'; // Veritabanı bağlantısı için pool (PostgreSQL)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const authResult = verifyAuth(req);

  if (!authResult.authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = authResult.userId;

  try {
    const basketId = req.query.basket_id; // Kullanıcının sepet ID'si
    if (!basketId) {
      return res.status(400).json({ error: 'Basket ID is required' });
    }

    const query = `
      SELECT o.id, o.basket_id, o.total_amount, o.status, o.created_at,
             json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.basket_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [basketId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
}
