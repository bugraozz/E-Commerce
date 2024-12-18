

import { getContentPages, saveContentPage, deleteContentPage } from '@/lib/contentPages';
import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
};

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (req.method === 'GET') {
    // GET isteği için yetkilendirme gerekmez
    const pages = await getContentPages();
    return res.status(200).json(pages);
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Unauthorized access attempt: Missing or invalid Authorization header');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const isAdmin = verifyToken(token);

  if (!isAdmin) {
    console.log('Unauthorized access attempt: User is not an admin');
    return res.status(403).json({ error: 'Forbidden' });
  }

  console.log('Request method:', req.method);

  if (req.method === 'POST') {
    const { slug, title, content } = req.body;
    console.log('Creating page with data:', { slug, title, content });
    const success = await saveContentPage(slug, { title, content });
    if (success) {
      return res.status(201).json({ message: 'Page created successfully' });
    } else {
      return res.status(500).json({ error: 'Error creating page' });
    }
  } else if (req.method === 'PUT') {
    const { slug, title, content } = req.body;
    console.log('Updating page with data:', { slug, title, content });
    const success = await saveContentPage(slug, { title, content });
    if (success) {
      return res.status(200).json({ message: 'Page updated successfully' });
    } else {
      return res.status(500).json({ error: 'Error updating page' });
    }
  } else if (req.method === 'DELETE') {
    const { slug } = req.body;
    console.log('Deleting page with slug:', slug);
    const success = await deleteContentPage(slug);
    if (success) {
      return res.status(200).json({ message: 'Page deleted successfully' });
    } else {
      return res.status(500).json({ error: 'Error deleting page' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}