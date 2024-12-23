import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models';
import { connectDB } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const token = generateVerificationToken();
    await sendVerificationEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
