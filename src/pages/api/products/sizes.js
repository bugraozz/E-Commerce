import db from '../../../lib/db';

export default async function handler(req, res) {
  const { gender } = req.query;

  if (!gender) {
    return res.status(400).json({ error: 'Gender is required' });
  }

  if (req.method === 'GET') {
    try {
      const query = `
        SELECT DISTINCT ps.size
        FROM "ProductSizes" ps
        JOIN "Products" p ON ps.product_id = p.id
        WHERE p.gender = $1 AND ps.stock > 0
        ORDER BY ps.size
      `;

      const result = await db.query(query, [gender]);
      const sizes = result.rows.map(row => row.size);
      res.status(200).json(sizes);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}