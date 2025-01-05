import { NextResponse } from 'next/server';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  try {
    const response = await api.get('/discover/movie', {
      params: {
        page,
        language: 'ru-RU',
        'vote_count.gte': 100,
        'vote_average.gte': 1,
        sort_by: 'popularity.desc',
        include_adult: false,
        'primary_release_date.lte': new Date().toISOString().split('T')[0]
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching popular movies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch movies' },
      { status: error.response?.status || 500 }
    );
  }
}
