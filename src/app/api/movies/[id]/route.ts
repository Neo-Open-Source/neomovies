import { NextResponse } from 'next/server';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        language: 'ru-RU',
        append_to_response: 'credits,videos,similar'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch movie details' },
      { status: error.response?.status || 500 }
    );
  }
}
