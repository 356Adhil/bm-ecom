import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

const Order =
  mongoose.models.Order ||
  mongoose.model('Order', {
    userId: String,
    items: Array,
    shipping: Object,
    payment: Object,
    total: Number,
    status: String,
    createdAt: { type: Date, default: Date.now },
  });

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const order = await Order.create({
      userId: session.user.id,
      ...data,
      status: 'pending',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Order creation failed' }, { status: 500 });
  }
}
