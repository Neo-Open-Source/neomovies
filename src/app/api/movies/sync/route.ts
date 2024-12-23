import { NextResponse } from 'next/server';
import { syncMovies } from '@/lib/movieSync';

export async function POST() {
  try {
    const movies = await syncMovies();
    return NextResponse.json({ success: true, movies });
  } catch (error) {
    console.error('Error syncing movies:', error);
    return NextResponse.json(
      { error: 'Failed to sync movies' },
      { status: 500 }
    );
  }
}
