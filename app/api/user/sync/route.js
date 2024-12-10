// app/api/user/sync/route.js
import { connectDB } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import Cart from '@/app/models/Cart';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          debug: { session },
        },
        { status: 401 }
      );
    }

    await connectDB();
    const { cart, wishlist } = await request.json();

    // First verify the user exists
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Update Cart using MongoDB _id
    await Cart.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
        })),
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Update Wishlist
    await User.findByIdAndUpdate(user._id, {
      wishlist: wishlist.map((item) => item.id),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Sync successful',
        userId: user._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      {
        message: 'Sync failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
