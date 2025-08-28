import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Add a property to favorites
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { propertyId } = await request.json();

  if (!propertyId) {
    return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });
  }

  try {
    const newFavorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId: propertyId,
      },
    });
    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    // P2002 is the Prisma code for a unique constraint violation
    // @ts-ignore
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Already in favorites' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

// Remove a property from favorites
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { propertyId } = await request.json();

  if (!propertyId) {
    return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });
  }

  try {
    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: propertyId,
        },
      },
    });
    return NextResponse.json({ message: 'Removed from favorites' }, { status: 200 });
  } catch (error) {
    // P2025 is the Prisma code for a record not found error
    // @ts-ignore
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Favorite not found' }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
