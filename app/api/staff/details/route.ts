// app/api/staff/details/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Optional authentication check - some staff details might be public
    // Uncomment these lines if you want to require authentication
    // if (!session || !session.user || !session.user.email) {
    //   return NextResponse.json({ 
    //     error: 'Unauthorized - Please sign in to view staff details' 
    //   }, { status: 401 })
    // }

    const { staffIds } = await request.json()

    if (!staffIds || !Array.isArray(staffIds)) {
      return NextResponse.json({ 
        error: 'Invalid staff IDs provided' 
      }, { status: 400 })
    }

    console.log('Fetching details for staff IDs:', staffIds)

    const staffProfiles = await prisma.staffProfile.findMany({
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
            email: true,
            phone: true,
            image: true
          }
        }
      }
    })

    const staffWithDetails = staffProfiles.map(staff => ({
      id: staff.id,
      userId: staff.userId,
      staffType: staff.staffType,
      hourlyRate: staff.hourlyRate,
      experience: staff.experience,
      bio: staff.bio,
      skills: staff.skills,
      equipment: staff.equipment,
      address: staff.address,
      latitude: staff.latitude,
      longitude: staff.longitude,
      maxRadius: staff.maxRadius,
      available: staff.available,
      verified: staff.verified,
      rating: staff.rating,
      reviewCount: staff.reviewCount,
      completedJobs: staff.completedJobs,
      user: {
        ...staff.user,
        image: staff.user.image || `https://api.dicebear.com/7.x/personas/svg?seed=${staff.user.name}`
      }
    }))

    console.log(`Returning details for ${staffWithDetails.length} staff members`)

    return NextResponse.json({
      staff: staffWithDetails
    })

  } catch (error) {
    console.error('Error fetching staff details:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Optional authentication check for individual staff details
    // if (!session || !session.user || !session.user.email) {
    //   return NextResponse.json({ 
    //     error: 'Unauthorized - Please sign in to view staff details' 
    //   }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staffId')

    if (!staffId) {
      return NextResponse.json({ 
        error: 'Staff ID is required' 
      }, { status: 400 })
    }

    console.log('Fetching details for staff ID:', staffId)

    const staffProfile = await prisma.staffProfile.findUnique({
      where: {
        id: staffId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        assignments: {
          include: {
            booking: {
              include: {
                event: {
                  select: {
                    title: true,
                    date: true,
                    venue: true
                  }
                }
              }
            }
          },
          where: {
            status: 'COMPLETED'
          },
          orderBy: {
            completedAt: 'desc'
          },
          take: 5
        }
      }
    })

    if (!staffProfile) {
      return NextResponse.json({ 
        error: 'Staff member not found' 
      }, { status: 404 })
    }

    const staffWithDetails = {
      id: staffProfile.id,
      userId: staffProfile.userId,
      staffType: staffProfile.staffType,
      hourlyRate: staffProfile.hourlyRate,
      experience: staffProfile.experience,
      bio: staffProfile.bio,
      skills: staffProfile.skills,
      equipment: staffProfile.equipment,
      address: staffProfile.address,
      latitude: staffProfile.latitude,
      longitude: staffProfile.longitude,
      maxRadius: staffProfile.maxRadius,
      available: staffProfile.available,
      verified: staffProfile.verified,
      rating: staffProfile.rating,
      reviewCount: staffProfile.reviewCount,
      completedJobs: staffProfile.completedJobs,
      user: {
        ...staffProfile.user,
        image: staffProfile.user.image || `https://api.dicebear.com/7.x/personas/svg?seed=${staffProfile.user.name}`
      },
      recentJobs: staffProfile.assignments.map(assignment => ({
        eventTitle: assignment.booking.event.title,
        eventDate: assignment.booking.event.date,
        venue: assignment.booking.event.venue,
        completedAt: assignment.completedAt,
        totalPay: assignment.totalPay
      }))
    }

    return NextResponse.json({
      staff: staffWithDetails
    })

  } catch (error) {
    console.error('Error fetching staff details:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}