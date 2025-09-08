// app/api/bookings/[id]/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params

    // Get the current client (in production, get from auth session)
    const client = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Fetch the specific booking with all related data
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: client.id // Ensure client can only access their own bookings
      },
      include: {
        event: true,
        staffBookings: {
          include: {
            // Include any staff assignments when you have them
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ 
        error: 'Booking not found or access denied' 
      }, { status: 404 })
    }

    // Transform staff bookings to staff members (similar to my-bookings route)
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
          myRating: undefined,
          checkInStatus: 'not-arrived', // Default check-in status
          expectedArrival: booking.event.startTime
        }))
      })
    )

    // Flatten staff members array
    const flatStaffMembers = staffMembers.flat()

    // Transform booking data to match frontend expectations
    const transformedBooking = {
      id: booking.id,
      eventTitle: booking.event.title || `Event at ${booking.event.venue}`,
      venue: booking.event.venue,
      address: booking.event.address,
      date: booking.event.date.toISOString().split('T')[0],
      startTime: booking.event.startTime,
      endTime: booking.event.endTime,
      status: booking.status.toLowerCase(),
      totalCost: booking.total,
      platformFee: booking.platformFee,
      subtotal: booking.subtotal,
      guestCount: booking.event.guestCount,
      specialInstructions: booking.event.description,
      eventType: 'event', // Default value
      staffMembers: flatStaffMembers
    }

    return NextResponse.json({ 
      booking: transformedBooking,
      message: 'Booking details fetched successfully' 
    })
  } catch (error) {
    console.error('Error fetching booking details:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch booking details',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const body = await request.json()
    
    const {
      eventTitle,
      venue,
      date,
      startTime,
      endTime,
      specialInstructions,
      guestCount
    } = body

    // Update the booking and associated event
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        event: {
          update: {
            title: eventTitle,
            venue: venue,
            date: date ? new Date(date) : undefined,
            startTime: startTime,
            endTime: endTime,
            description: specialInstructions,
            guestCount: guestCount ? parseInt(guestCount) : undefined
          }
        }
      },
      include: {
        event: true,
        staffBookings: true
      }
    })

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({
      error: 'Failed to update booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    
    // Check if booking can be deleted (e.g., not in progress or completed)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') {
      return NextResponse.json({
        error: 'Cannot delete booking that is in progress or completed'
      }, { status: 400 })
    }

    // Delete the booking (this will cascade to related records)
    await prisma.booking.delete({
      where: { id: bookingId }
    })

    return NextResponse.json({
      message: 'Booking deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({
      error: 'Failed to delete booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}