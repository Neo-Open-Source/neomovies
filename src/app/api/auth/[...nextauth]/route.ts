import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';

// Расширяем тип User в сессии
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      verified: boolean;
      isAdmin: boolean;
      adminVerified?: boolean;
    } & DefaultSession['user']
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdminLogin: { label: 'isAdminLogin', type: 'boolean' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Необходимо указать email и пароль');
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Пользователь не найден');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Неверный пароль');
        }

        // Проверяем верификацию
        if (!user.verified) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        // Если это попытка входа в админ-панель
        if (credentials.isAdminLogin === 'true') {
          // Проверяем, является ли пользователь админом
          if (!user.isAdmin) {
            throw new Error('NOT_AN_ADMIN');
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          verified: user.verified,
          isAdmin: user.isAdmin,
          adminVerified: credentials.isAdminLogin === 'true'
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.verified = user.verified;
        token.isAdmin = user.isAdmin;
        token.adminVerified = user.adminVerified;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.verified = token.verified as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.adminVerified = token.adminVerified as boolean;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
