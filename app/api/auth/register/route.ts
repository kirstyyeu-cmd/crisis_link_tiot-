import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // TODO: replace with real DB check
    // const existing = await db.users.findOne({ email });
    // if (existing) return error

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: replace with real DB insert
    // await db.users.create({ fullName, email, password: hashedPassword });
    console.log('New user:', { fullName, email, hashedPassword });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}