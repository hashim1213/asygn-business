// app/api/bookings/[id]/messages/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id
    const { staffId, message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        error: 'Message content is required'
      }, { status: 400 })
    }

    // Get the current client (in production, get from auth session)
    const client = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Verify the booking belongs to this client
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: client.id
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

    // Create the message record (you'll need to create a Message model)
    // For now, we'll simulate this and just return success
    const messageRecord = {
      id: `msg_${Date.now()}`,
      bookingId: bookingId,
      senderId: client.id,
      receiverId: staff.userId,
      content: message,
      createdAt: new Date(),
      read: false
    }

    // TODO: Create actual message in database when Message model is added
    // const newMessage = await prisma.message.create({
    //   data: {
    //     bookingId: bookingId,
    //     senderId: client.id,
    //     receiverId: staff.userId,
    //     content: message,
    //     messageType: 'TEXT'
    //   }
    // })

    // TODO: Send real-time notification to staff member
    // This could be done via WebSocket, push notification, or email

    return NextResponse.json({
      message: 'Message sent successfully',
      messageId: messageRecord.id,
      timestamp: messageRecord.createdAt
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id
    const url = new URL(request.url)
    const staffId = url.searchParams.get('staffId')

    // Get the current client
    const client = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Verify booking access
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: client.id
      }
    })

    if (!booking) {
      return NextResponse.json({
        error: 'Booking not found or access denied'
      }, { status: 404 })
    }

    // TODO: Fetch actual messages when Message model is implemented
    // const messages = await prisma.message.findMany({
    //   where: {
    //     bookingId: bookingId,
    //     ...(staffId && {
    //       OR: [
    //         { senderId: staffId },
    //         { receiverId: staffId }
    //       ]
    //     })
    //   },
    //   orderBy: { createdAt: 'asc' },
    //   include: {
    //     sender: { select: { name: true, role: true } },
    //     receiver: { select: { name: true, role: true } }
    //   }
    // })

    // Mock messages for now
    const messages = [
      {
        id: 'msg_1',
        content: "I'll arrive 30 minutes early to set up.",
        senderId: staffId || 'staff_1',
        senderName: 'Alex Johnson',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      }
    ]

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