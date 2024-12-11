// import db from '../../../lib/db';
// import { verifyAuth } from '../../../lib/auth';
// import jwt from 'jsonwebtoken';

// export default async function handler(req, res) {
//   // Kimlik doğrulaması yapılacak
//   const authResult = await verifyAuth(req);
//   if (!authResult.authenticated) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const userId = authResult.userId;

//   if (req.method === 'GET') {
//     try {
      
//       const result = await db.query(
//         'SELECT f.product_id AS id, p.name, p.price, p.images[1] AS image FROM favorites f JOIN products p ON f.product_id = p.id WHERE f.user_id = $1',
//         [userId]
//       );
//       res.status(200).json(result.rows);
//     } catch (error) {
//       console.error('Failed to fetch favorites:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else if (req.method === 'POST') {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const { id, name, price, image } = req.body;
    
//       await db.query(
//         'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING',
//         [userId, id]
//       );
//       res.status(200).json({ message: 'Added to favorites' });
//     } catch (error) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }




// import { verifyAuth } from '../../../lib/auth'
// import db from '../../../lib/db'
// import jwt from 'jsonwebtoken'

// export default async function handler(req, res) {
//   console.log('Favorites API called:', req.method)
//   console.log('Request headers:', req.headers)
//   console.log('Request body:', req.body)

//   try {
//     const authResult = await verifyAuth(req)
//     console.log('Auth result:', authResult)

//     if (!authResult.authenticated) {
//       console.log('Authentication failed')
//       return res.status(401).json({ error: 'Unauthorized' })
//     }

//     const userId = authResult.userId
//     console.log('Authenticated user ID:', userId)

//     if (req.method === 'GET') {
//       try {
//         const result = await db.query(
//           'SELECT p.id, p.name, p.price, p.images[1] AS image FROM favorites f JOIN "Products" p ON f.product_id = p.id WHERE f.user_id = $1',
//           [userId]
//         )
//         res.status(200).json(result.rows)
//       } catch (error) {
//         console.error('Failed to fetch favorites:', error)
//         res.status(500).json({ error: 'Internal server error' })
//       }
//     } else if (req.method === 'POST') {
//       const token = req.headers.authorization?.split(' ')[1]

//       if (!token) {
//         console.log('No token provided')
//         return res.status(401).json({ error: 'Unauthorized' })
//       }

//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         console.log('Decoded token:', decoded)

//         const { id, name, price, image } = req.body
//         console.log('Adding favorite:', { id, name, price, image })

//         const result = await db.query(
//           'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *',
//           [userId, id]
//         )

//         console.log('Database query result:', result)

//         if (result.rowCount > 0) {
//           res.status(200).json({ message: 'Added to favorites', favorite: { id, name, price, image } })
//         } else {
//           res.status(200).json({ message: 'Product already in favorites' })
//         }
//       } catch (error) {
//         console.error('Error processing request:', error)
//         return res.status(401).json({ error: 'Unauthorized' })
//       }
//     } else {
//       res.setHeader('Allow', ['GET', 'POST'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//     }
//   } catch (error) {
//     console.error('Error in favorites handler:', error)
//     res.status(500).json({ error: 'Internal server error' })
//   }
// }



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
          'SELECT f.product_id AS id, p.name, p.price, p.image FROM favorites f JOIN "Products" p ON f.product_id = p.id WHERE f.user_id = $1',
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