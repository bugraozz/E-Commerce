



import { verifyAuth } from '../../../lib/auth'
import db from '../../../lib/db'

export default async function handler(req, res) {
  console.log('Favorites API called:', req.method)
  console.log('Request body:', req.body)
  try {
    const authResult = await verifyAuth(req)
    if (!authResult.authenticated) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = authResult.userId

    if (req.method === 'GET') {
      try {
        const result = await db.query(
          `SELECT f.product_id AS id, p.name, p.price, p.category, p.gender,
           COALESCE(ARRAY_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), ARRAY[]::text[]) AS images
           FROM favorites f 
           JOIN "Products" p ON f.product_id = p.id
           LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
           WHERE f.user_id = $1
           GROUP BY f.product_id, p.id, p.name, p.price, p.category, p.gender`,
          [userId]
        )
        res.status(200).json(result.rows)
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
    } else if (req.method === 'POST') {
            const { id } = req.body
      try {
        const result = await db.query(
          'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *',
          [userId, id]
        )
        if (result.rowCount > 0) {
          const productResult = await db.query(
            'SELECT id, name, price, image FROM "Products" WHERE id = $1',
            [id]
          )
          const favorite = productResult.rows[0]
          res.status(200).json({ message: 'Added to favorites', favorite })
        } else {
          res.status(200).json({ message: 'Product already in favorites' })
        }
      } catch (error) {
        console.error('Failed to add to favorites:', error)
        res.status(500).json({ error: 'Failed to add to favorites' })
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    console.log('Favorites API response:', res.statusCode)
  } catch (error) {
    console.error('Error in favorites handler:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}