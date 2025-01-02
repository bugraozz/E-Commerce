// import db from '../../lib/db';

// export default async function handler(req, res) {
//   const { q: query } = req.query;

//   if (!query) {
//     return res.status(400).json({ error: 'Arama terimi gerekli' });
//   }

//   try {
//     const searchQuery = `
//       SELECT id, name, price, category, gender
//       FROM "Products"
//       WHERE name ILIKE $1
//       ORDER BY name ASC
//       LIMIT 20
//     `;
//     const result = await db.query(searchQuery, [`%${query}%`]);
//     return res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Ürün arama hatası:', error);
//     return res.status(500).json({ error: 'Veritabanı hatası' });
//   }
// }



import db from '../../lib/db';

export default async function handler(req, res) {
  const { q: query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Arama terimi gerekli' });
  }

  try {
    const searchQuery = `
      SELECT p.id, p.name, p.price, p.category, p.gender, 
             COALESCE(ARRAY_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), ARRAY[]::text[]) AS images
      FROM "Products" p
      LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
      WHERE p.name ILIKE $1
      GROUP BY p.id, p.name, p.price, p.category, p.gender
      ORDER BY p.name ASC
      LIMIT 20
    `;
    const result = await db.query(searchQuery, [`%${query}%`]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ürün arama hatası:', error);
    return res.status(500).json({ error: 'Veritabanı hatası' });
  }
}

