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

    const response = await fetch(`${API_BASE_URL}/api/reject-reasons/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to update reject reason');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating reject reason:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update reject reason' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/reject-reasons/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to delete reject reason');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting reject reason:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete reject reason' },
      { status: 500 }
    );
  }
}
