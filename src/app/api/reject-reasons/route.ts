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

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/reject-reasons`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to fetch reject reasons');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reject reasons:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch reject reasons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/reject-reasons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to create reject reason');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating reject reason:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create reject reason' },
      { status: 500 }
    );
  }
}
