// import jwt from 'jsonwebtoken';

// export function verifyAuth(token: string | undefined) {
//   if (!token) {
//     console.log('No token provided');
//     return { authenticated: false, error: 'No token provided' };
//   }

//   if (typeof token !== 'string') {
//     console.log('Token is not a string');
//     return { authenticated: false, error: 'Invalid token format' };
//   }

//   if (!process.env.JWT_SECRET) {
//     console.error('JWT_SECRET is not set in environment variables');
//     return { authenticated: false, error: 'Server configuration error' };
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded token:', decoded);
//     return { authenticated: true, userId: (decoded as any).id };
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       console.log('Token expired');
//       return { authenticated: false, error: 'Token expired' };
//     }
//     if (error instanceof jwt.JsonWebTokenError) {
//       console.log('Invalid token:', error.message);
//       return { authenticated: false, error: 'Invalid token' };
//     }
//     console.error('Token verification failed:', error);
//     return { authenticated: false, error: 'Token verification failed' };
//   }
// }




// import jwt from 'jsonwebtoken'

// export async function verifyAuth(req) {
//   const token = req.headers.authorization?.split(' ')[1]
//   console.log('Received token:', token)

//   if (!token) {
//     console.log('No token provided')
//     return { authenticated: false }
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     console.log('Decoded token:', decoded)
//     return { authenticated: true, userId: decoded.id }
//   } catch (error) {
//     console.error('Token verification failed:', error)
//     return { authenticated: false }
//   }
// }


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
