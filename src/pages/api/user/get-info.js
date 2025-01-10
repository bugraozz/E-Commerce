import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import db from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const user = await db.query(
      'SELECT Username, email, phone, adress, city, country, zipcode FROM "Users" WHERE id = $1',
      [userId]
    )

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user.rows[0])
  } catch (error) {
    console.error('Error fetching user info:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

