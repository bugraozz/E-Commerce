


import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number
  role: string
  iat: number
  exp: number
}

export function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  // Authorization başlığını kontrol edin
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Invalid or missing authorization header');
    return { authenticated: false, error: 'Invalid or missing authorization header' };
  }

  // Tokeni ayıklayın
  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  try {
    // Token doğrulaması
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    return { authenticated: true, userId: (decoded as any).id };
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return { authenticated: false, error: 'Invalid or expired token' };
  }
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
    console.log('Çözülen token:', decoded)
    return decoded
  } catch (error) {
    console.error('Token doğrulama hatası:', error)
    return null
  }
}
