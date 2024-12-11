import jwt from 'jsonwebtoken';
import db from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  console.log(`Received ${req.method} request`);

  if (req.method === 'POST') {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const result = await db.query(
        'SELECT * FROM "Users" WHERE "Username" = $1',
        [Username]
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (isPasswordValid) {
          const { Password, ...userWithoutPassword } = user;
          const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

          return res.status(200).json({ message: 'Login successful', user: { ...userWithoutPassword, token } });
        } else {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error("Error during login:", error); 
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT id, "Username", email, adress, phone, gender, role FROM "Users"');
      console.log(`Retrieved ${result.rows.length} "Users" from database`);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { id, role } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!id || !role) {
        return res.status(400).json({ error: 'Eksik veri: id ve role gerekli!' });
      }

      try {
        await db.query('BEGIN');

        await db.query(
          'UPDATE "Users" SET role = $1 WHERE id = $2',
          [role, id]
        );

        await db.query('COMMIT');
        res.status(200).json({ message: 'Role updated', id, role });
      } catch (error) {
        await db.query('ROLLBACK');
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


