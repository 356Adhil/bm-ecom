// app/api/wishlist/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import Wishlist from '@/app/models/Wishlist';
import { connectToDatabase } from '@/app/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    await connectToDatabase();
    const wishlist = await Wishlist.findOne({ userId: session.user.id });

    return Response.json(wishlist?.items || []);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    const item = await request.json();
    await connectToDatabase();

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: session.user.id },
      {
        $addToSet: {
          items: {
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          },
        },
      },
      { upsert: true, new: true }
    );

    return Response.json(wishlist.items);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
