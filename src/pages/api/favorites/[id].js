import db from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  const authResult = await verifyAuth(req)
  if (!authResult.authenticated) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = authResult.userId
  const productId = req.query.id

  if (req.method === 'DELETE') {
    try {
      await db.query(
        'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      )
      res.status(200).json({ message: 'Removed from favorites' })
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      res.status(500).json({ error: 'Failed to remove from favorites' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}