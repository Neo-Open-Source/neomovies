import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/favorites/check/[mediaId] - проверить есть ли в избранном
export async function GET(
  request: Request,
  { params }: { params: { mediaId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaType = searchParams.get('mediaType');

    const { db } = await connectToDatabase();

    const favorite = await db.collection('favorites').findOne({
      userId: session.user.email,
      mediaId: params.mediaId,
      mediaType
    });

    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json({ error: 'Failed to check favorite status' }, { status: 500 });
  }
}
