// app/api/bookings/my-bookings/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('My-bookings session check:', { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      userEmail: session?.user?.email
    })
    
    // Check if session exists and has user with email
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to view bookings' 
      }, { status: 401 })
    }

    // Find the user in the database using email (same as booking creation)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database' 
      }, { status: 404 })
    }

    console.log('Fetching bookings for user:', user.id)

    // Fetch bookings with all related data
    const bookings = await prisma.booking.findMany({
      where: {
        clientId: user.id
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${bookings.length} bookings for user`)

    // Transform data to match frontend interface
    const transformedBookings = await Promise.all(
      bookings.map(async (booking) => {
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
            myRating: undefined
          }))
        } else {
          // Fallback: Generate staff based on staffBookings (for demo purposes)
          const staffBookingMembers = await Promise.all(
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
          staffMembers = staffBookingMembers.flat()
        }

        return {
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
      })
    )

    console.log(`Returning ${transformedBookings.length} transformed bookings`)

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