import { NextApiRequest, NextApiResponse } from 'next'
import { getContentPages } from '@/lib/contentPages'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pages = await getContentPages()
      return res.status(200).json(pages)
    } catch (error) {
      console.error('Error fetching content pages:', error)
      return res.status(500).json({ error: 'Error fetching content pages' })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

