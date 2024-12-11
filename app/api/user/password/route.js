// app/api/user/password/route.js
import { getServerSession } from 'next-auth';
import { connectDB } from '@/app/lib/db';
import User from '@/app/models/User';
import { authOptions } from '@/app/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ message: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update password:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
