// app/api/user/profile/route.js
import { getServerSession } from 'next-auth';
import { connectDB } from '@/app/lib/db';
import User from '@/app/models/User';
import { authOptions } from '@/app/lib/auth';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { name, email } = await request.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    user.name = name;
    user.email = email;
    await user.save();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
