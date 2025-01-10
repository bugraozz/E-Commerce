import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    for (const item of items) {
      const { id, size, quantity } = item;

      console.log(`Updating stock for product ID: ${id}, size: ${size}, quantity: ${quantity}`);

      // Update stock
      const result = await client.query(
        'UPDATE "ProductSizes" SET stock = stock - $1 WHERE product_id = $2 AND size = $3 RETURNING stock',
        [quantity, id, size]
      );

      if (result.rows.length === 0) {
        throw new Error(`Product not found: id=${id}, size=${size}`);
      }

      const newStock = result.rows[0].stock;
      console.log(`New stock for product ID: ${id}, size: ${size}: ${newStock}`);

      if (newStock < 0) {
        throw new Error(`Insufficient stock for product: id=${id}, size=${size}`);
      }
    }

    await client.query('COMMIT');
    console.log('Stock update transaction committed successfully');
    res.status(200).json({ message: 'Order processed and stock updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing order and updating stock:', error);
    res.status(500).json({ message: 'Error processing order and updating stock', error: error.message });
  } finally {
    client.release();
  }
}

