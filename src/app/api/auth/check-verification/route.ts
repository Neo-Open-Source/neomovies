import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({ verified: user.verified ?? false });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
