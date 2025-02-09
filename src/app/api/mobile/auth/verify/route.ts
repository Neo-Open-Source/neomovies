import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({
      email,
      verificationCode: code,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный код или код истек' },
        { status: 400 }
      );
    }

    // Подтверждаем email
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { verified: true },
        $unset: { verificationCode: "", verificationExpires: "" }
      }
    );

    // Создаем JWT токен
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        verified: true,
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
        verified: true,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Ошибка верификации' },
      { status: 500 }
    );
  }
}
