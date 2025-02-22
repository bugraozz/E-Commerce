import db from '../../lib/db'
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { Username, email, Password, phone } = req.body

    if (!Username || !email || !Password || !phone) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    try {
      const existingUser = await db.query('SELECT * FROM "Users" WHERE "Username" = $1 OR email = $2 OR phone = $3', [Username, email, phone])

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Username, email, or phone number already exists' })
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(Password, saltRounds)

      const result = await db.query(
        'INSERT INTO "Users" ("Username", email, "Password", phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, "Username", email, phone, role',
        [Username, email, hashedPassword, phone, 'user'] 
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