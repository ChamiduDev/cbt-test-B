import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const backendRes = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.msg || 'An error occurred' },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
