import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/mailer';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const { db } = await connectToDatabase();

    // Проверяем, существует ли пользователь
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email уже зарегистрирован' },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await hash(password, 12);

    // Генерируем код подтверждения
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    // Создаем пользователя
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      verified: false,
      verificationCode,
      verificationExpires,
      isAdmin: false, // Явно указываем, что новый пользователь не админ
      createdAt: new Date(),
    });

    // Отправляем код подтверждения
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({
      success: true,
      email,
      message: 'Пользователь успешно зарегистрирован',
    });
  } catch {
    return NextResponse.json(
      { message: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}
