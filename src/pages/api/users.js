

import db from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  console.log(`Received ${req.method} request`);

  if (req.method === 'POST') {
    const { Username, Password } = req.body;
    console.log(`Login attempt with Username: ${Username}`);

    if (!Username || !Password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const result = await db.query(
        'SELECT * FROM "Users" WHERE "Username" = $1',
        [Username]
      );

      console.log('Database query result:', result.rows);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        
        // Use bcrypt to compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (isPasswordValid) {
          console.log(`Login successful for Username: ${Username}`);
          // Don't send the password back to the client
          const { Password, ...userWithoutPassword } = user;
          res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
        } else {
          console.log(`Invalid credentials for Username: ${Username}`);
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        console.log(`User not found: ${Username}`);
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT id, "Username", email, role FROM "Users"');
      console.log(`Retrieved ${result.rows.length} "Users" from database`);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { id, role } = req.body;

    // Gerekli alanların kontrolü
    if (!id || !role) {
        return res.status(400).json({ error: 'Eksik veri: id ve role gerekli!' });
    }

    try {
        await db.query('BEGIN');

        // Sadece role alanını güncelleyen sorgu
        await db.query(
            'UPDATE "Users" SET role = $1 WHERE id = $2',
            [role, id]
        );

        await db.query('COMMIT');
        res.status(200).json({ message: 'Role updated', id, role }); // Güncellenen role'ü geri döndür
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}