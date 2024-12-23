import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }

    if (user.verificationExpires < new Date()) {
      return NextResponse.json(
        { error: 'Код подтверждения истек' },
        { status: 400 }
      );
    }

    // Подтверждаем аккаунт
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          verified: true,
          verificationCode: null,
          verificationExpires: null,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: 'Ошибка при подтверждении' },
      { status: 500 }
    );
  }
}
