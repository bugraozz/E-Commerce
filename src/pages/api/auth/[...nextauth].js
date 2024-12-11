import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'

const usersFile = path.join(process.cwd(), 'data', 'users.json')

async function getUser(email) {
  try {
    const data = await fs.readFile(usersFile, 'utf8')
    const users = JSON.parse(data)
    return users.find(user => user.email === email)
  } catch (error) {
    console.error('Error reading users file:', error)
    return null
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorize called with credentials:', credentials)
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password')
          throw new Error('Email ve şifre gereklidir')
        }

        const user = await getUser(credentials.email)
        console.log('User found:', user)

        if (!user) {
          console.log('User not found')
          throw new Error('Bu email adresi ile kayıtlı kullanıcı bulunamadı')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        console.log('Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          console.log('Invalid password')
          throw new Error('Geçersiz şifre')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback called with token:', token)
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      console.log('Session after modification:', session)
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)