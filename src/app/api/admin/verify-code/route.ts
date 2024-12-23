import { NextResponse } from 'next/server';
import { User } from '@/models';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    
    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    // Проверяем код
    if (!user.adminVerificationCode ||
        user.adminVerificationCode.code !== code ||
        new Date() > new Date(user.adminVerificationCode.expiresAt)) {
      return NextResponse.json(
        { error: 'Неверный или устаревший код подтверждения' },
        { status: 400 }
      );
    }

    // Очищаем код после успешной проверки
    user.adminVerificationCode = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при проверке кода' },
      { status: 500 }
    );
  }
}
