import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { type, gender } = req.query;
    try {
      let query = 'SELECT * FROM "Categories" WHERE is_deleted = FALSE';
      const params = [];

      if (type) {
        query += ' AND type = $1';
        params.push(type);
      }

      if (gender) {
        query += params.length ? ' AND gender = $2' : ' AND gender = $1';
        params.push(gender);
      }

      const result = await db.query(query, params);
      res.status(200).json(result.rows.length ? result.rows : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, gender } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO "Categories" (name, gender) VALUES ($1, $2) RETURNING *',
        [name, gender]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
        await db.query('BEGIN');

        await db.query('DELETE FROM "ProductImages" WHERE product_id IN (SELECT id FROM "Products" WHERE category = (SELECT name FROM "Categories" WHERE id = $1))', [id]);
      await db.query('DELETE FROM "ProductSizes" WHERE product_id IN (SELECT id FROM "Products" WHERE category = (SELECT name FROM "Categories" WHERE id = $1))', [id]);
      await db.query('DELETE FROM "Products" WHERE category = (SELECT name FROM "Categories" WHERE id = $1)', [id]);

        // Kategoriyi pasif hale getir
        const result = await db.query('DELETE FROM "Categories" WHERE id = $1 RETURNING *', [parseInt(id, 10)]);

        await db.query('COMMIT');

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.status(200).json({ message: 'Category marked as deleted', category: result.rows[0] });
        }
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
}

 else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}