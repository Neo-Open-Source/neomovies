import { NextResponse } from 'next/server';
import { User } from '@/models';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, secret } = await req.json();

    // Проверяем секретный ключ
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || secret !== adminSecret) {
      return NextResponse.json(
        { error: 'Неверный секретный ключ' },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Назначаем пользователя администратором
    user.isAdmin = true;
    await user.save();

    return NextResponse.json({ 
      success: true,
      message: 'Пользователь успешно назначен администратором'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при назначении администратора' },
      { status: 500 }
    );
  }
}
