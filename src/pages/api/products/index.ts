import db from '../../../lib/db';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { category, gender, sizes } = req.query;
    try {
      let query = `
        SELECT p.*, 
               array_agg(DISTINCT pi.image_url) as images,
               json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) as sizes
        FROM "Products" p 
        LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
        LEFT JOIN "ProductSizes" ps ON p.id = ps.product_id
      `;
      const params = [];
      const conditions = [];

      if (category) {
        conditions.push(`p.category = $${params.length + 1}`);
        params.push(category);
      }
      if (gender) {
        conditions.push(`p.gender = $${params.length + 1}`);
        params.push(gender);
      }
      if (sizes) {
        const sizesArray = sizes.split(',');
        conditions.push(`ps.size = ANY($${params.length + 1})`);
        params.push(sizesArray);
      }

      if (conditions.length) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ' GROUP BY p.id';

      const result = await db.query(query, params);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, price, images, category, gender, description, sizes } = req.body;
  
    if (!gender) {
      return res.status(400).json({ error: 'Gender bilgisi eksik.' });
    }
  
    try {
      await db.query('BEGIN');

      const productResult = await db.query(
        'INSERT INTO "Products" (name, price, category, gender, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, price, category, gender, description]
      );
      
      const productId = productResult.rows[0].id;

      for (let i = 0; i < images.length; i++) {
        await db.query(
          'INSERT INTO "ProductImages" (product_id, image_url, order_index) VALUES ($1, $2, $3)',
          [productId, images[i], i]
        );
      }

      for (const size of sizes) {
        await db.query(
          'INSERT INTO "ProductSizes" (product_id, size, stock) VALUES ($1, $2, $3)',
          [productId, size.size, size.stock]
        );
      }

      await db.query('COMMIT');

      res.status(201).json({ message: 'Product added successfully', productId });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



