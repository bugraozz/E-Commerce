import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = `
        SELECT DISTINCT size
        FROM "ProductSizes"
        WHERE stock > 0
        ORDER BY size
      `;

      const result = await db.query(query);
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