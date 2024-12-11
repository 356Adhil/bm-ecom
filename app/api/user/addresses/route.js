import { getServerSession } from 'next-auth';
import { connectDB } from '@/app/lib/db';
import Address from '@/app/models/Address';
import { authOptions } from '@/app/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectDB();
    const addresses = await Address.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(addresses), {
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

    const addressData = await request.json();
    await connectDB();

    // Check if this is the first address
    const addressCount = await Address.countDocuments({ userId: session.user.id });
    const isDefault = addressData.isDefault || addressCount === 0;

    // If this will be a default address, remove default from other addresses
    if (isDefault) {
      await Address.updateMany({ userId: session.user.id }, { $set: { isDefault: false } });
    }

    // Create new address
    const newAddress = await Address.create({
      ...addressData,
      userId: session.user.id,
      isDefault,
    });

    return new Response(JSON.stringify(newAddress), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to add address:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add address', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    if (!addressId) {
      return new Response('Address ID is required', { status: 400 });
    }

    await connectDB();

    // Check if address exists and belongs to user
    const address = await Address.findOne({
      _id: addressId,
      userId: session.user.id,
    });

    if (!address) {
      return new Response('Address not found', { status: 404 });
    }

    // If we're deleting a default address
    if (address.isDefault) {
      // Find another address to make default
      const anotherAddress = await Address.findOne({
        userId: session.user.id,
        _id: { $ne: addressId },
      });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    await Address.findByIdAndDelete(addressId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');
    const updateData = await request.json();

    if (!addressId) {
      return new Response('Address ID is required', { status: 400 });
    }

    await connectDB();

    // If setting as default, remove default from other addresses
    if (updateData.isDefault) {
      await Address.updateMany(
        {
          userId: session.user.id,
          _id: { $ne: addressId },
        },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId: session.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return new Response('Address not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedAddress), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update address:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
