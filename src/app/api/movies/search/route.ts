import { NextResponse } from 'next/server';
import { searchAPI } from '@/lib/neoApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Используем обновленный multiSearch, который теперь запрашивает и фильмы, и сериалы параллельно
    const response = await searchAPI.multiSearch(query, parseInt(page));
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search',
        details: error.message || 'Unknown error'
      },
      { status: error.response?.status || 500 }
    );
  }
}
