// app/api/bookings/[id]/ratings/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST_RATINGS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to submit ratings' 
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
    const { staffId, rating, review } = await request.json()

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Verify the booking belongs to this user and is completed
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId: user.id,
        status: 'COMPLETED'
      }
    })

    if (!booking) {
      return NextResponse.json({
        error: 'Booking not found, access denied, or booking not completed'
      }, { status: 404 })
    }

    // Verify staff member exists
    const staff = await prisma.staffProfile.findUnique({
      where: { id: staffId }
    })

    if (!staff) {
      return NextResponse.json({
        error: 'Staff member not found'
      }, { status: 404 })
    }

    // Check if rating already exists
    const existingRating = await prisma.rating.findFirst({
      where: {
        bookingId: bookingId,
        raterId: user.id,
        rateeId: staff.userId
      }
    })

    if (existingRating) {
      return NextResponse.json({
        error: 'You have already rated this staff member for this booking'
      }, { status: 400 })
    }

    // Create the rating
    const newRating = await prisma.rating.create({
      data: {
        bookingId: bookingId,
        raterId: user.id,
        rateeId: staff.userId,
        rating: rating,
        review: review || null,
        ratingType: 'CLIENT_TO_STAFF'
      }
    })

    // Update staff member's average rating
    const allRatings = await prisma.rating.findMany({
      where: {
        rateeId: staff.userId,
        ratingType: 'CLIENT_TO_STAFF'
      }
    })

    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length

    await prisma.staffProfile.update({
      where: { id: staffId },
      data: {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: allRatings.length
      }
    })

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: newRating,
      newAverageRating: averageRating
    })
  } catch (error) {
    console.error('Error submitting rating:', error)
    return NextResponse.json({
      error: 'Failed to submit rating',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET_RATINGS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to view ratings' 
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

    // Get all ratings for this booking made by this user
    const ratings = await prisma.rating.findMany({
      where: {
        bookingId: bookingId,
        raterId: user.id,
        ratingType: 'CLIENT_TO_STAFF'
      },
      include: {
        ratee: {
          include: {
            staffProfile: true
          }
        }
      }
    })

    return NextResponse.json({
      ratings: ratings
    })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json({
      error: 'Failed to fetch ratings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}