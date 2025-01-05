import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase, resetIndexes } from '@/lib/mongodb';

// Флаг для отслеживания инициализации
let isInitialized = false;

// GET /api/favorites - получить все избранные
export async function GET() {
  try {
    // Инициализируем индексы при первом запросе
    if (!isInitialized) {
      await resetIndexes();
      isInitialized = true;
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const favorites = await db.collection('favorites')
      .find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 });
  }
}

// POST /api/favorites - добавить в избранное
export async function POST(request: Request) {
  try {
    // Инициализируем индексы при первом запросе
    if (!isInitialized) {
      await resetIndexes();
      isInitialized = true;
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mediaId, mediaType, title, posterPath } = await request.json();
    
    if (!mediaId || !mediaType || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const favorite = {
      userId: session.user.email,
      mediaId: mediaId.toString(), // Преобразуем в строку для консистентности
      mediaType,
      title,
      posterPath,
      createdAt: new Date()
    };

    // Используем updateOne с upsert вместо insertOne
    const result = await db.collection('favorites').updateOne(
      {
        userId: session.user.email,
        mediaId: favorite.mediaId,
        mediaType
      },
      { $set: favorite },
      { upsert: true }
    );

    // Если документ был обновлен (уже существовал)
    if (result.matchedCount > 0) {
      return NextResponse.json({ message: 'Already in favorites' }, { status: 200 });
    }

    // Если документ был создан (новый)
    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
  }
}
