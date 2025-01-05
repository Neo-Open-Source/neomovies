import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?page=${page}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
