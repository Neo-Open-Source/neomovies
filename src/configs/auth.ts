import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';

export const authOptions: AuthOptions = {
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

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Неверный пароль');
        }

        if (credentials.isAdminLogin === 'true' && !user.isAdmin) {
          throw new Error('У вас нет прав администратора');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          verified: user.verified,
          isAdmin: user.isAdmin,
          adminVerified: user.adminVerified
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.verified = user.verified;
        token.isAdmin = user.isAdmin;
        token.adminVerified = user.adminVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.verified = token.verified as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.adminVerified = token.adminVerified as boolean;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
