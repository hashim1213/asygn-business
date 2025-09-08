// app/api/bookings/create/route.ts - Simplified version without TypeScript extensions
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

interface CreateBookingRequest {
  eventDetails: {
    title: string
    description?: string
    venue: string
    address: string
    latitude?: number
    longitude?: number
    date: string
    startTime: string
    endTime: string
    eventType?: string
    guestCount?: number
  }
  selectedStaff: {
    staffId: string
    hourlyRate: number
    staffType: string
  }[]
  requirements: {
    staffType: string
    quantity: number
    hourlyRate: number
  }[]
}

// Map frontend staff types to database enum values
const mapStaffType = (frontendType: string) => {
  const mapping: { [key: string]: string } = {
    'bartender': 'BARTENDER',
    'server': 'SERVER',
    'barback': 'BARBACK',
    'event-crew': 'EVENT_CREW',
    'BARTENDER': 'BARTENDER',
    'SERVER': 'SERVER',
    'BARBACK': 'BARBACK',
    'EVENT_CREW': 'EVENT_CREW'
  }
  return mapping[frontendType] || frontendType.toUpperCase()
}

const mapEventType = (frontendType: string) => {
  const mapping: { [key: string]: string } = {
    'event': 'OTHER',
    'shift': 'OTHER',
    'catering': 'OTHER',
    'wedding': 'WEDDING',
    'corporate': 'CORPORATE',
    'birthday': 'BIRTHDAY',
    'festival': 'FESTIVAL',
    'concert': 'CONCERT',
    'other': 'OTHER',
    'WEDDING': 'WEDDING',
    'CORPORATE': 'CORPORATE',
    'BIRTHDAY': 'BIRTHDAY',
    'FESTIVAL': 'FESTIVAL',
    'CONCERT': 'CONCERT',
    'OTHER': 'OTHER'
  }
  return mapping[frontendType] || 'OTHER'
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session check:', { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      userEmail: session?.user?.email
    })
    
    // Check if session exists and has user with email
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found - Please sign in' 
      }, { status: 401 })
    }

    if (!session.user) {
      return NextResponse.json({ 
        error: 'No user in session - Please sign in again' 
      }, { status: 401 })
    }

    if (!session.user.email) {
      return NextResponse.json({ 
        error: 'No email in session - Please sign in again' 
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

    const body: CreateBookingRequest = await request.json()
    const { eventDetails, selectedStaff, requirements } = body

    console.log('Creating booking with:', { 
      eventTitle: eventDetails.title,
      staffCount: selectedStaff?.length || 0,
      userId: user.id 
    })

    // Validate required fields
    if (!eventDetails.title || !eventDetails.venue || !eventDetails.date || 
        !eventDetails.startTime || !eventDetails.endTime) {
      return NextResponse.json({ 
        error: 'Missing required event details' 
      }, { status: 400 })
    }

    if (!selectedStaff || selectedStaff.length === 0) {
      return NextResponse.json({ 
        error: 'No staff selected' 
      }, { status: 400 })
    }

    // Calculate event duration in hours
    const startDateTime = new Date(`${eventDetails.date}T${eventDetails.startTime}`)
    const endDateTime = new Date(`${eventDetails.date}T${eventDetails.endTime}`)
    let durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60)

    // Handle overnight events
    if (durationHours <= 0) {
      durationHours += 24
    }

    // Minimum 2 hours
    durationHours = Math.max(durationHours, 2)

    console.log('Event duration:', durationHours, 'hours')

    // For testing purposes, check which staff exist in database
    const staffIds = selectedStaff.map(s => s.staffId)
    
    const existingStaffProfiles = await prisma.staffProfile.findMany({
      where: {
        id: {
          in: staffIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    console.log(`Found ${existingStaffProfiles.length} existing staff profiles out of ${staffIds.length} requested`)

    // Calculate pricing
    let subtotal = 0
    const staffBookingData = selectedStaff.map(staff => {
      const cost = staff.hourlyRate * durationHours
      subtotal += cost
      
      return {
        staffType: mapStaffType(staff.staffType) as any,
        quantity: 1,
        hourlyRate: staff.hourlyRate
      }
    })

    const platformFeeRate = 0.15
    const platformFee = subtotal * platformFeeRate
    const total = subtotal + platformFee

    console.log('Pricing calculated:', { subtotal, platformFee, total, durationHours })

    // Create the booking with all related data in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the event
      const event = await tx.event.create({
        data: {
          title: eventDetails.title,
          description: eventDetails.description,
          venue: eventDetails.venue,
          address: eventDetails.address,
          latitude: eventDetails.latitude,
          longitude: eventDetails.longitude,
          date: new Date(eventDetails.date),
          startTime: eventDetails.startTime,
          endTime: eventDetails.endTime,
          eventType: mapEventType(eventDetails.eventType || 'OTHER') as any,
          guestCount: eventDetails.guestCount,
          organizerId: user.id,
          status: 'PUBLISHED'
        }
      })

      console.log('Event created:', event.id)

      // Create the booking
      const booking = await tx.booking.create({
        data: {
          eventId: event.id,
          clientId: user.id,
          subtotal,
          platformFee,
          total,
          status: 'PENDING',
          paymentStatus: 'PENDING'
        }
      })

      console.log('Booking created:', booking.id)

      // Create staff booking records
      await tx.staffBooking.createMany({
        data: staffBookingData.map(staff => ({
          bookingId: booking.id,
          ...staff
        }))
      })

      console.log('Staff booking records created')

      // Only create staff assignments for existing staff profiles
      if (existingStaffProfiles.length > 0) {
        const staffAssignments = await Promise.all(
          selectedStaff
            .filter(staff => existingStaffProfiles.some(esp => esp.id === staff.staffId))
            .map(staff => 
              tx.staffAssignment.create({
                data: {
                  bookingId: booking.id,
                  staffId: staff.staffId,
                  status: 'PENDING',
                  hourlyRate: staff.hourlyRate,
                  notes: `Auto-assigned for ${eventDetails.title}`
                }
              })
            )
        )

        console.log('Staff assignments created:', staffAssignments.length)

        // Send notification messages to existing staff members
        const messagePromises = selectedStaff
          .filter(staff => existingStaffProfiles.some(esp => esp.id === staff.staffId))
          .map(staff => {
            const staffProfile = existingStaffProfiles.find(sp => sp.id === staff.staffId)
            if (staffProfile) {
              return tx.message.create({
                data: {
                  bookingId: booking.id,
                  senderId: user.id,
                  receiverId: staffProfile.userId,
                  content: `You've been selected for an event: ${eventDetails.title} on ${new Date(eventDetails.date).toLocaleDateString()} at ${eventDetails.venue}. Please confirm your availability.`,
                  messageType: 'SYSTEM'
                }
              })
            }
            return null
          })
          .filter(Boolean)

        if (messagePromises.length > 0) {
          await Promise.all(messagePromises)
          console.log('Notification messages sent:', messagePromises.length)
        }
      }

      return {
        booking,
        event
      }
    })

    // Return the created booking with all details
    const bookingWithDetails = await prisma.booking.findUnique({
      where: { id: result.booking.id },
      include: {
        event: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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

    console.log('Booking creation completed successfully')

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: bookingWithDetails
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to retrieve user's bookings
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user in the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {
      clientId: user.id
    }

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase()
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        event: true,
        staffAssignments: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                  }
                }
              }
            }
          }
        },
        staffBookings: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.booking.count({
      where: whereClause
    })

    return NextResponse.json({
      bookings,
      total,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch bookings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}