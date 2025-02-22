import db from '@/lib/db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.query(`
      SELECT p.id, p.name, p.price, p.category, p.gender,
      COALESCE(ARRAY_AGG(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), ARRAY[]::text[]) AS images,
      json_agg(DISTINCT jsonb_build_object('size', ps.size, 'stock', ps.stock)) AS sizes,
      SUM(oi.quantity) AS salesCount
      FROM order_items oi
      JOIN "Products" p ON oi.product_id = p.id
      LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
      LEFT JOIN "ProductSizes" ps ON p.id = ps.product_id
      GROUP BY p.id
      ORDER BY salesCount DESC
      LIMIT 4
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
}
