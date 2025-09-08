// app/api/bookings/my-bookings/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // For now, get the first client since we don't have auth yet
    // In production, you'd get this from the session/JWT token
    const client = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!client) {
      return NextResponse.json({ error: 'No client found' }, { status: 404 })
    }

    // Fetch bookings with all related data
    const bookings = await prisma.booking.findMany({
      where: {
        clientId: client.id
      },
      include: {
        event: true,
        staffBookings: {
          include: {
            // We'll need to create applications/assignments to track individual staff
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match frontend interface
    const transformedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // Get staff members for this booking (simulated for now)
        const staffMembers = await Promise.all(
          booking.staffBookings.map(async (staffBooking) => {
            // Find available staff of this type for demonstration
            const availableStaff = await prisma.staffProfile.findMany({
              where: {
                staffType: staffBooking.staffType,
                available: true,
                verified: true
              },
              include: {
                user: true
              },
              take: staffBooking.quantity
            })

            return availableStaff.map((staff, index) => ({
              id: staff.id,
              name: staff.user.name || 'Unknown',
              role: staffBooking.staffType.toLowerCase().replace('_', ' '),
              hourlyRate: staff.hourlyRate,
              status: index === 0 ? 'confirmed' : 'pending', // Mock status
              profileImg: `https://api.dicebear.com/7.x/personas/svg?seed=${staff.user.name}`,
              phone: staff.user.phone || '(555) 000-0000',
              email: staff.user.email,
              rating: staff.rating,
              experience: staff.experience || 'Experience not listed',
              lastMessage: index === 0 ? "I'll arrive 30 minutes early to set up." : undefined,
              messageTime: index === 0 ? '2 hours ago' : undefined,
              canRate: booking.status === 'COMPLETED',
              myRating: undefined
            }))
          })
        )

        // Flatten staff members array
        const flatStaffMembers = staffMembers.flat()

        return {
          id: booking.id,
          eventTitle: booking.event.title || `Event at ${booking.event.venue}`,
          venue: booking.event.venue,
          date: booking.event.date.toISOString().split('T')[0],
          startTime: booking.event.startTime,
          endTime: booking.event.endTime,
          status: booking.status.toLowerCase(),
          totalCost: booking.total,
          platformFee: booking.platformFee,
          subtotal: booking.subtotal,
          guestCount: booking.event.guestCount,
          specialInstructions: booking.event.description,
          staffMembers: flatStaffMembers
        }
      })
    )

    return NextResponse.json({ 
      bookings: transformedBookings,
      message: 'Bookings fetched successfully' 
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch bookings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}