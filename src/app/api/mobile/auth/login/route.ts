import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    // Создаем JWT токен
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        verified: user.verified,
        isAdmin: user.isAdmin
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        verified: user.verified,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка входа' },
      { status: 500 }
    );
  }
}
