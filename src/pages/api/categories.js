

import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { gender } = req.query;
    try {
      let query = 'SELECT * FROM "Categories"';
      const params = [];

      if (gender) {
        query += ' WHERE gender = $1';
        params.push(gender);
      }

      const result = await db.query(query, params);
      res.status(200).json(result.rows);
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}