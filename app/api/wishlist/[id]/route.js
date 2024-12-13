// app/api/wishlist/[id]/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import Wishlist from '@/app/models/Wishlist';
import { connectToDatabase } from '@/app/lib/db';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    await connectToDatabase();
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: session.user.id },
      { $pull: { items: { productId: parseInt(params.id) } } },
      { new: true }
    );

    return Response.json(wishlist.items);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
