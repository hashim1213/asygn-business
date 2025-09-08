// app/api/bookings/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { 
      jobTitle,
      jobType,
      venue,
      location, 
      date, 
      startTime, 
      endTime, 
      description,
      staffRequests,
      clientId 
    } = await request.json()

    console.log('Creating booking with:', { 
      jobTitle, jobType, venue, location, date, startTime, endTime, staffRequests 
    })

    // Get the first client from the database since we don't have auth yet
    const client = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!client) {
      return NextResponse.json({ 
        error: 'No client found - run the seed script first' 
      }, { status: 400 })
    }

    // Calculate hours properly
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    
    // Handle overnight shifts
    if (hours <= 0) {
      hours += 24
    }
    
    // Minimum 2 hours
    hours = Math.max(hours, 2)

    // Calculate pricing
    const subtotal = staffRequests.reduce((sum: number, req: any) => {
      return sum + (req.hourlyRate * req.quantity * hours)
    }, 0)
    
    const platformFee = subtotal * 0.15
    const total = subtotal + platformFee

    console.log('Pricing calculated:', { hours, subtotal, platformFee, total })

    // Create event
    const event = await prisma.event.create({
      data: {
        title: jobTitle || `${jobType} at ${venue}`,
        venue: venue,
        address: location,
        date: new Date(date),
        startTime,
        endTime,
        description: description || null,
        organizerId: client.id,
        status: 'PUBLISHED'
      }
    })

    console.log('Event created:', event.id)

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        eventId: event.id,
        clientId: client.id,
        subtotal,
        platformFee,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    })

    console.log('Booking created:', booking.id)

    // Create staff bookings for each type requested
    for (const req of staffRequests) {
      await prisma.staffBooking.create({
        data: {
          bookingId: booking.id,
          staffType: req.type.toUpperCase() as any, // Convert to enum value
          quantity: req.quantity,
          hourlyRate: req.hourlyRate
        }
      })
    }

    console.log('Staff bookings created')

    return NextResponse.json({ 
      bookingId: booking.id,
      total,
      subtotal,
      platformFee,
      hours,
      message: 'Booking created successfully'
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}