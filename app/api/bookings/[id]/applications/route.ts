
// app/api/bookings/[id]/applications/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET_APPLICATIONS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to view applications' 
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database' 
      }, { status: 404 })
    }

    // Verify the booking belongs to this user
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        clientId: user.id
      }
    })

    if (!booking) {
      return NextResponse.json({
        error: 'Booking not found or access denied'
      }, { status: 404 })
    }

    const applications = await prisma.application.findMany({
      where: {
        bookingId: params.id
      },
      include: {
        staff: true,
        staffProfile: true
      }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Applications error:', error)
    return NextResponse.json({ 
      error: 'Failed to get applications',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}