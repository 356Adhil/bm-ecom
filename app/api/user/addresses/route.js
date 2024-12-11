// app/api/user/addresses/route.js
import { getServerSession } from 'next-auth';
import { connectDB } from '@/app/lib/db';
import User from '@/app/models/User';
import { authOptions } from '@/app/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify(user.addresses || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const address = await request.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // If this is the first address or marked as default, update other addresses
    if (address.isDefault || !user.addresses?.length) {
      if (user.addresses) {
        user.addresses = user.addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }
    }

    // Add new address
    user.addresses = [...(user.addresses || []), { ...address, id: new Date().getTime() }];
    await user.save();

    return new Response(JSON.stringify(address), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to add address:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
