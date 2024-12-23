import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Movie } from '@/models';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { movieId } = await request.json();
    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    movie.isVisible = !movie.isVisible;
    await movie.save();

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error('Error toggling movie visibility:', error);
    return NextResponse.json(
      { error: 'Failed to toggle movie visibility' },
      { status: 500 }
    );
  }
}
