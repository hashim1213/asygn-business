// app/api/bookings/[id]/messages/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST_MESSAGES(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to send messages' 
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

    const bookingId = params.id
    const { staffId, message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        error: 'Message content is required'
      }, { status: 400 })
    }

    // Verify the booking belongs to this user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: user.id
      }
    })

    if (!booking) {
      return NextResponse.json({
        error: 'Booking not found or access denied'
      }, { status: 404 })
    }

    // Find the staff member
    const staff = await prisma.staffProfile.findUnique({
      where: { id: staffId },
      include: { user: true }
    })

    if (!staff) {
      return NextResponse.json({
        error: 'Staff member not found'
      }, { status: 404 })
    }

    // Create the message record
    const newMessage = await prisma.message.create({
      data: {
        bookingId: bookingId,
        senderId: user.id,
        receiverId: staff.userId,
        content: message,
        messageType: 'TEXT'
      }
    })

    return NextResponse.json({
      message: 'Message sent successfully',
      messageId: newMessage.id,
      timestamp: newMessage.createdAt
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET_MESSAGES(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to view messages' 
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

    const bookingId = params.id
    const url = new URL(request.url)
    const staffId = url.searchParams.get('staffId')

    // Verify booking access
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: user.id
      }
    })

    if (!booking) {
      return NextResponse.json({
        error: 'Booking not found or access denied'
      }, { status: 404 })
    }

    // Fetch actual messages
    const messages = await prisma.message.findMany({
      where: {
        bookingId: bookingId,
        ...(staffId && {
          OR: [
            { senderId: staffId },
            { receiverId: staffId }
          ]
        })
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true, role: true } },
        receiver: { select: { name: true, role: true } }
      }
    })

    return NextResponse.json({
      messages: messages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
