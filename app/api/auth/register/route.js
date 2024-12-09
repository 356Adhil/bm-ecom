import { connectDB } from '@/app/lib/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    await User.create({ name, email, password });
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
