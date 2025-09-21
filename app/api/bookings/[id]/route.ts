// app/api/bookings/[id]/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to view booking details' 
      }, { status: 401 })
    }

    // Find the user in the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database' 
      }, { status: 404 })
    }

    const { id: bookingId } = await params

    // Fetch the specific booking with all related data
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: user.id // Ensure client can only access their own bookings
      },
      include: {
        event: true,
        staffBookings: true,
        staffAssignments: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ 
        error: 'Booking not found or access denied' 
      }, { status: 404 })
    }

    let staffMembers: any[] = []

    // If we have staff assignments (from the enhanced booking flow), use those
    if (booking.staffAssignments && booking.staffAssignments.length > 0) {
      staffMembers = booking.staffAssignments.map((assignment) => ({
        id: assignment.staff.id,
        name: assignment.staff.user.name || 'Unknown',
        role: assignment.staff.staffType.toLowerCase().replace('_', ' '),
        hourlyRate: assignment.hourlyRate,
        status: assignment.status.toLowerCase(),
        profileImg: assignment.staff.user.image || `https://api.dicebear.com/7.x/personas/svg?seed=${assignment.staff.user.name}`,
        phone: assignment.staff.user.phone || '(555) 000-0000',
        email: assignment.staff.user.email,
        rating: assignment.staff.rating,
        experience: assignment.staff.experience || 'Experience not listed',
        lastMessage: undefined,
        messageTime: undefined,
        canRate: booking.status === 'COMPLETED',
        myRating: undefined,
        checkInStatus: 'not-arrived',
        expectedArrival: booking.event.startTime
      }))
    } else {
      // Fallback: Transform staff bookings to staff members (for demo/legacy bookings)
      const staffMembersArrays = await Promise.all(
        booking.staffBookings.map(async (staffBooking) => {
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
            status: index === 0 ? 'confirmed' : 'pending',
            profileImg: `https://api.dicebear.com/7.x/personas/svg?seed=${staff.user.name}`,
            phone: staff.user.phone || '(555) 000-0000',
            email: staff.user.email,
            rating: staff.rating,
            experience: staff.experience || 'Experience not listed',
            lastMessage: index === 0 ? "I'll arrive 30 minutes early to set up." : undefined,
            messageTime: index === 0 ? '2 hours ago' : undefined,
            canRate: booking.status === 'COMPLETED',
            myRating: undefined,
            checkInStatus: 'not-arrived',
            expectedArrival: booking.event.startTime
          }))
        })
      )

      staffMembers = staffMembersArrays.flat()
    }

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
      eventType: booking.event.eventType?.toLowerCase() || 'event',
      staffMembers: staffMembers
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
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to update booking' 
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

    // Verify the booking belongs to this user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: user.id
      }
    })

    if (!existingBooking) {
      return NextResponse.json({
        error: 'Booking not found or access denied'
      }, { status: 404 })
    }

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
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to delete booking' 
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

    const { id: bookingId } = await params
    
    // Check if booking exists and belongs to user
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
