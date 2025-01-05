import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

// DELETE /api/favorites/[mediaId] - удалить из избранного
export async function DELETE(
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
    const mediaId = params.mediaId;

    if (!mediaType || !mediaId) {
      return NextResponse.json({ error: 'Missing mediaType or mediaId' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('favorites').deleteOne({
      userId: session.user.email,
      mediaId,
      mediaType
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
}
