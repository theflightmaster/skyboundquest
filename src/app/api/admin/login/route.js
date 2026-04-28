import { NextResponse } from 'next/server';

const ADMIN_USERID = process.env.ADMIN_USERID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    // Compare with environment variables
    if (userId === ADMIN_USERID && password === ADMIN_PASSWORD) {
      // Create a simple session token (you can enhance this with JWT later)
      const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: token,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid user ID or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}