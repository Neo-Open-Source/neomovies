import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const { userId } = await req.json();
    
    await connectDB();
    
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем, что это не последний администратор
    if (targetUser.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Нельзя отозвать права у последнего администратора' },
          { status: 400 }
        );
      }
    }

    // Переключаем статус администратора
    targetUser.isAdmin = !targetUser.isAdmin;
    await targetUser.save();

    return NextResponse.json({
      success: true,
      isAdmin: targetUser.isAdmin,
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при изменении прав администратора' },
      { status: 500 }
    );
  }
}
