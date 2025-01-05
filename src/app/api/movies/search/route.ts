import { NextResponse } from 'next/server';
import { searchAPI } from '@/lib/neoApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await searchAPI.multiSearch(query);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search',
        details: error.message
      },
      { status: 500 }
    );
  }
}
