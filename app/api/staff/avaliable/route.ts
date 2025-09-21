// app/api/staff/availability/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

interface AvailabilityCheckRequest {
  staffIds: string[]
  date: string
  startTime: string
  endTime: string
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: AvailabilityCheckRequest = await request.json()
    const { staffIds, date, startTime, endTime } = body

    // Validate input
    if (!staffIds?.length || !date || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'Missing required fields: staffIds, date, startTime, endTime' 
      }, { status: 400 })
    }

    console.log('Checking availability for:', { staffIds, date, startTime, endTime })

    // Parse event times
    const eventDate = new Date(date)
    const eventStart = new Date(`${date}T${startTime}`)
    let eventEnd = new Date(`${date}T${endTime}`)

    // Handle overnight events
    if (eventEnd < eventStart) {
      eventEnd.setDate(eventEnd.getDate() + 1)
    }

    // Check if all staff members exist and are available
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
            email: true
          }
        }
      }
    })

    if (staffProfiles.length !== staffIds.length) {
      const foundIds = staffProfiles.map(p => p.id)
      const missingIds = staffIds.filter(id => !foundIds.includes(id))
      
      return NextResponse.json({ 
        error: 'Some staff members not found',
        missingStaffIds: missingIds
      }, { status: 404 })
    }

    // Check for scheduling conflicts
    const conflictingAssignments = await prisma.staffAssignment.findMany({
      where: {
        staffId: {
          in: staffIds
        },
        booking: {
          event: {
            date: {
              gte: new Date(eventDate.toDateString()),
              lt: new Date(eventDate.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        },
        status: {
          in: ['ACCEPTED', 'CONFIRMED', 'IN_PROGRESS']
        }
      },
      include: {
        staff: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        booking: {
          include: {
            event: {
              select: {
                startTime: true,
                endTime: true,
                title: true
              }
            }
          }
        }
      }
    })

    // Check for time overlaps
    const conflicts: any[] = []
    const unavailableStaffIds = new Set<string>()

    conflictingAssignments.forEach(assignment => {
      const existingStart = new Date(`${date}T${assignment.booking.event.startTime}`)
      let existingEnd = new Date(`${date}T${assignment.booking.event.endTime}`)
      
      // Handle overnight existing booking
      if (existingEnd < existingStart) {
        existingEnd.setDate(existingEnd.getDate() + 1)
      }
      
      // Check for time overlap
      const hasOverlap = (
        (eventStart >= existingStart && eventStart < existingEnd) ||
        (eventEnd > existingStart && eventEnd <= existingEnd) ||
        (eventStart <= existingStart && eventEnd >= existingEnd)
      )
      
      if (hasOverlap) {
        unavailableStaffIds.add(assignment.staffId)
        conflicts.push({
          staffId: assignment.staffId,
          staffName: assignment.staff.user.name,
          conflictingEvent: assignment.booking.event.title,
          conflictingTime: `${assignment.booking.event.startTime} - ${assignment.booking.event.endTime}`
        })
      }
    })

    // Separate available and unavailable staff
    const availableStaff = staffProfiles.filter(staff => 
      staff.available && !unavailableStaffIds.has(staff.id)
    )
    const unavailableStaff = staffProfiles.filter(staff => 
      !staff.available || unavailableStaffIds.has(staff.id)
    )

    const result = {
      totalRequested: staffIds.length,
      available: availableStaff.length,
      unavailable: unavailableStaff.length,
      allAvailable: availableStaff.length === staffIds.length,
      availableStaff: availableStaff.map(staff => ({
        id: staff.id,
        name: staff.user.name,
        staffType: staff.staffType,
        hourlyRate: staff.hourlyRate,
        rating: staff.rating
      })),
      unavailableStaff: unavailableStaff.map(staff => {
        const conflict = conflicts.find(c => c.staffId === staff.id)
        return {
          id: staff.id,
          name: staff.user.name,
          staffType: staff.staffType,
          reason: !staff.available ? 'Not available' : 'Schedule conflict',
          conflict: conflict ? {
            event: conflict.conflictingEvent,
            time: conflict.conflictingTime
          } : null
        }
      }),
      conflicts: conflicts
    }

    console.log('Availability check result:', {
      available: result.available,
      unavailable: result.unavailable,
      conflictsCount: conflicts.length
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check a single staff member's availability
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staffId')
    const date = searchParams.get('date')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    if (!staffId || !date || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    // Check if staff member exists
    const staffProfile = await prisma.staffProfile.findUnique({
      where: { id: staffId },
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

    if (!staffProfile) {
      return NextResponse.json({ 
        error: 'Staff member not found' 
      }, { status: 404 })
    }

    if (!staffProfile.available) {
      return NextResponse.json({
        available: false,
        reason: 'Staff member is not currently available',
        staff: {
          id: staffProfile.id,
          name: staffProfile.user.name,
          staffType: staffProfile.staffType
        }
      })
    }

    // Parse event times
    const eventDate = new Date(date)
    const eventStart = new Date(`${date}T${startTime}`)
    let eventEnd = new Date(`${date}T${endTime}`)

    // Handle overnight events
    if (eventEnd < eventStart) {
      eventEnd.setDate(eventEnd.getDate() + 1)
    }

    // Check for scheduling conflicts
    const conflictingAssignments = await prisma.staffAssignment.findMany({
      where: {
        staffId: staffId,
        booking: {
          event: {
            date: {
              gte: new Date(eventDate.toDateString()),
              lt: new Date(eventDate.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        },
        status: {
          in: ['ACCEPTED', 'CONFIRMED', 'IN_PROGRESS']
        }
      },
      include: {
        booking: {
          include: {
            event: {
              select: {
                title: true,
                startTime: true,
                endTime: true
              }
            }
          }
        }
      }
    })

    // Check for time overlaps
    const conflicts = conflictingAssignments.filter(assignment => {
      const existingStart = new Date(`${date}T${assignment.booking.event.startTime}`)
      let existingEnd = new Date(`${date}T${assignment.booking.event.endTime}`)
      
      if (existingEnd < existingStart) {
        existingEnd.setDate(existingEnd.getDate() + 1)
      }
      
      return (
        (eventStart >= existingStart && eventStart < existingEnd) ||
        (eventEnd > existingStart && eventEnd <= existingEnd) ||
        (eventStart <= existingStart && eventEnd >= existingEnd)
      )
    })

    const isAvailable = conflicts.length === 0

    return NextResponse.json({
      available: isAvailable,
      staff: {
        id: staffProfile.id,
        name: staffProfile.user.name,
        staffType: staffProfile.staffType,
        hourlyRate: staffProfile.hourlyRate,
        rating: staffProfile.rating
      },
      conflicts: conflicts.map(assignment => ({
        eventTitle: assignment.booking.event.title,
        startTime: assignment.booking.event.startTime,
        endTime: assignment.booking.event.endTime
      }))
    })

  } catch (error) {
    console.error('Single availability check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}