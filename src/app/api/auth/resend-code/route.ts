import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/mailer';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Генерируем новый код
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    // Обновляем код в базе
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          verificationCode,
          verificationExpires,
        },
      }
    );

    // Отправляем новый код
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: 'Ошибка при отправке кода' },
      { status: 500 }
    );
  }
}
