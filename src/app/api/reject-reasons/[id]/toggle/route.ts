import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const response = await fetch(`${API_BASE_URL}/api/reject-reasons/${params.id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to toggle reject reason status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling reject reason status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to toggle reject reason status' },
      { status: 500 }
    );
  }
}
