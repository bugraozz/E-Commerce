import db from '../../lib/db'
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { Username, email, Password } = req.body

    // Check if all required fields are present
    if (!Username || !email || !Password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    try {
      const existingUser = await db.query('SELECT * FROM "Users" WHERE "Username" = $1 OR email = $2', [Username, email])

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' })
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(Password, saltRounds)

      const result = await db.query(
        'INSERT INTO "Users" ("Username", email, "Password", role) VALUES ($1, $2, $3, $4) RETURNING id, "Username", email, role',
        [Username, email, hashedPassword, 'user'] 
      )

      res.status(201).json(result.rows[0])
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}