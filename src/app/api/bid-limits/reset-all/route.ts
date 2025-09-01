import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get('x-auth-token');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/bid-limits/reset-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to reset all bid limits');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error resetting all bid limits:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset all bid limits' },
      { status: 500 }
    );
  }
}
