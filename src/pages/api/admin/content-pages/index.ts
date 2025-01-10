


import { NextApiRequest, NextApiResponse } from 'next'
import { getContentPages, saveContentPage, deleteContentPage } from '@/lib/contentPages'
import jwt from 'jsonwebtoken'

const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string }
  } catch (error) {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
  }

  if (req.method === 'GET') {
    try {
      const pages = await getContentPages()
      console.log('API: Fetched pages:', pages) // Debugging line
      return res.status(200).json(pages)
    } catch (error) {
      console.error('Error fetching content pages:', error)
      return res.status(500).json({ error: 'Error fetching content pages' })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const { slug, title, content } = req.body
    try {
      const page = await saveContentPage(slug, { title, content })
      return res.status(req.method === 'POST' ? 201 : 200).json(page)
    } catch (error) {
      console.error(`Error ${req.method === 'POST' ? 'creating' : 'updating'} content page:`, error)
      return res.status(500).json({ error: `Error ${req.method === 'POST' ? 'creating' : 'updating'} content page` })
    }
  }

  if (req.method === 'DELETE') {
    const { slug } = req.body
    try {
      const deletedPage = await deleteContentPage(slug)
      if (deletedPage) {
        return res.status(200).json({ message: 'Page deleted successfully' })
      } else {
        return res.status(404).json({ error: 'Page not found' })
      }
    } catch (error) {
      console.error('Error deleting content page:', error)
      return res.status(500).json({ error: 'Error deleting content page' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

