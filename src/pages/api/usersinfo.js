


import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT id, "Username", email, adress, phone, city, country, zipcode, gender FROM "Users"');
      console.log(`Retrieved ${result.rows.length} "Users" from database`);
      console.log('Fetched data:', result.rows);

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { Username, email, adress, phone, city, country, zipcode, gender } = req.body;

    if (!Username || !email || !adress || !phone || !city || !country || !zipcode || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const result = await db.query(
        `INSERT INTO "Users" ("Username", email, adress, phone, city, country, zipcode, gender)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (email)
         DO UPDATE SET "Username" = $1, email = $2, adress = $3, phone = $4, city = $5, country = $6, zipcode = $7, gender = $8
         RETURNING id, "Username", email, adress, phone, city, country, zipcode, gender`,
        [Username, email, adress, phone, city, country, zipcode, gender]
      );
      
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Update/Insert error:', error);
      res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}