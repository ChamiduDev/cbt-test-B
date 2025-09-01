import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }
    
    let url = `${API_BASE_URL}/api/bookings`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to fetch bookings');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
