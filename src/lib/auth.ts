import jwt from 'jsonwebtoken'

export async function verifyAuth(req) {
  const token = req.headers.authorization?.split(' ')[1]
  console.log('Received token:', token)

  if (!token) {
    console.log('No token provided')
    return { authenticated: false }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded)
    return { authenticated: true, userId: decoded.id }
  } catch (error) {
    console.error('Token verification failed:', error)
    return { authenticated: false }
  }
}