import { NextResponse } from 'next/server';

export const revalidate = 0; // always fresh

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('imdb_id');
    const tmdbId = searchParams.get('tmdb_id');

    if (!imdbId && !tmdbId) {
      return NextResponse.json({ error: 'imdb_id or tmdb_id query param is required' }, { status: 400 });
    }

    const token = process.env.ALLOHA_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Server misconfiguration: ALLOHA_TOKEN missing' }, { status: 500 });
    }

    const idParam = imdbId ? `imdb=${encodeURIComponent(imdbId)}` : `tmdb=${encodeURIComponent(tmdbId!)}`;
    const apiUrl = `https://api.alloha.tv/?token=${token}&${idParam}`;
    const apiRes = await fetch(apiUrl, { next: { revalidate: 0 } });

    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Alloha' }, { status: apiRes.status });
    }

    const json = await apiRes.json();
    if (json.status !== 'success' || !json.data?.iframe) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ iframe: json.data.iframe });
  } catch (e) {
    console.error('Alloha API route error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
