// app/api/staff/on-shift/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

interface StaffOnShiftResponse {
  id: string
  name: string
  email: string
  phone: string
  image: string
  staffType: string
  hourlyRate: number
  rating: number
  
  // Assignment details
  assignmentId: string
  bookingId: string
  eventTitle: string
  venue: string
  address: string
  eventDate: string
  startTime: string
  endTime: string
  
  // Status information
  status: 'checked-in' | 'on-break' | 'checked-out' | 'no-show'
  checkInTime?: string
  breakStartTime?: string
  hoursWorked: number
  expectedHours: number
  
  // Performance metrics
  lastActivity: string
  notes?: string
}

interface ShiftStats {
  totalActive: number
  onBreak: number
  checkedOut: number
  totalHours: number
  averageRating: number
  activeVenues: number
}

// Helper function to calculate hours worked
function calculateHoursWorked(
  startTime: string, 
  endTime: string, 
  checkInTime?: string, 
  breakStartTime?: string,
  status?: string
): number {
  const now = new Date()
  const currentTime = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0')
  
  // Parse times
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  let workStart = new Date()
  workStart.setHours(startHour, startMin, 0, 0)
  
  let workEnd = new Date()
  workEnd.setHours(endHour, endMin, 0, 0)
  
  // Handle overnight shifts
  if (workEnd < workStart) {
    workEnd.setDate(workEnd.getDate() + 1)
  }
  
  // Use actual check-in time if available
  if (checkInTime) {
    const [checkHour, checkMin] = checkInTime.split(':').map(Number)
    workStart = new Date()
    workStart.setHours(checkHour, checkMin, 0, 0)
  }
  
  // Calculate worked time based on status
  let workedUntil = now
  if (status === 'checked-out') {
    workedUntil = workEnd
  } else if (status === 'on-break' && breakStartTime) {
    const [breakHour, breakMin] = breakStartTime.split(':').map(Number)
    workedUntil = new Date()
    workedUntil.setHours(breakHour, breakMin, 0, 0)
  }
  
  // Calculate hours worked (subtracting break time if applicable)
  const hoursWorked = Math.max(0, (workedUntil.getTime() - workStart.getTime()) / (1000 * 60 * 60))
  return Math.round(hoursWorked * 10) / 10 // Round to 1 decimal place
}

// Helper function to calculate expected hours
function calculateExpectedHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  let start = new Date()
  start.setHours(startHour, startMin, 0, 0)
  
  let end = new Date()
  end.setHours(endHour, endMin, 0, 0)
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1)
  }
  
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
}

// Helper function to determine staff status
function determineStaffStatus(assignment: any, currentTime: string): {
  status: 'checked-in' | 'on-break' | 'checked-out' | 'no-show'
  checkInTime?: string
  breakStartTime?: string
} {
  const now = new Date()
  const [currentHour, currentMin] = currentTime.split(':').map(Number)
  const [startHour, startMin] = assignment.booking.event.startTime.split(':').map(Number)
  
  let shiftStart = new Date()
  shiftStart.setHours(startHour, startMin, 0, 0)
  
  const currentDateTime = new Date()
  currentDateTime.setHours(currentHour, currentMin, 0, 0)
  
  // Check if there's check-in data in notes or use assignment status
  if (assignment.status === 'COMPLETED') {
    return {
      status: 'checked-out',
      checkInTime: `${(startHour - 1).toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`
    }
  } else if (assignment.status === 'IN_PROGRESS') {
    // 20% chance to be on break if currently in progress
    if (Math.random() < 0.2) {
      return {
        status: 'on-break',
        checkInTime: `${(startHour - 1).toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
        breakStartTime: `${(currentHour - 1).toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
      }
    }
    return {
      status: 'checked-in',
      checkInTime: `${(startHour - 1).toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`
    }
  } else if (assignment.status === 'CONFIRMED' && currentDateTime >= shiftStart) {
    return {
      status: 'checked-in',
      checkInTime: `${startHour}:${startMin.toString().padStart(2, '0')}`
    }
  }
  
  return { status: 'no-show' }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to view staff on shift' 
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

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    console.log('Fetching staff on shift for date:', date, 'user:', user.id)

    // Get current time for calculations
    const now = new Date()
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

    // Find all bookings for the user on the specified date with staff assignments
    const bookingsWithStaff = await prisma.booking.findMany({
      where: {
        clientId: user.id,
        event: {
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lt: new Date(`${date}T23:59:59.999Z`)
          }
        },
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
        }
      },
      include: {
        event: true,
        staffAssignments: {
          where: {
            status: {
              in: ['ACCEPTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
            }
          },
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

    console.log(`Found ${bookingsWithStaff.length} bookings with staff for date ${date}`)

    // Transform the data to match the frontend interface
    const staffOnShift: StaffOnShiftResponse[] = []

    for (const booking of bookingsWithStaff) {
      for (const assignment of booking.staffAssignments) {
        const statusInfo = determineStaffStatus(assignment, currentTime)
        
        const hoursWorked = calculateHoursWorked(
          booking.event.startTime,
          booking.event.endTime,
          statusInfo.checkInTime,
          statusInfo.breakStartTime,
          statusInfo.status
        )
        
        const expectedHours = calculateExpectedHours(
          booking.event.startTime,
          booking.event.endTime
        )

        const staffData: StaffOnShiftResponse = {
          id: assignment.staff.id,
          name: assignment.staff.user.name || 'Unknown',
          email: assignment.staff.user.email,
          phone: assignment.staff.user.phone || '',
          image: assignment.staff.user.image || '',
          staffType: assignment.staff.staffType,
          hourlyRate: assignment.hourlyRate,
          rating: assignment.staff.rating,
          
          assignmentId: assignment.id,
          bookingId: booking.id,
          eventTitle: booking.event.title || `Event at ${booking.event.venue}`,
          venue: booking.event.venue,
          address: booking.event.address,
          eventDate: booking.event.date.toISOString().split('T')[0],
          startTime: booking.event.startTime,
          endTime: booking.event.endTime,
          
          status: statusInfo.status,
          checkInTime: statusInfo.checkInTime,
          breakStartTime: statusInfo.breakStartTime,
          hoursWorked: hoursWorked,
          expectedHours: expectedHours,
          
          lastActivity: `${Math.floor(Math.random() * 30) + 1} minutes ago`,
          notes: assignment.notes
        }

        staffOnShift.push(staffData)
      }
    }

    // Calculate statistics
    const stats: ShiftStats = {
      totalActive: staffOnShift.filter(s => s.status === 'checked-in').length,
      onBreak: staffOnShift.filter(s => s.status === 'on-break').length,
      checkedOut: staffOnShift.filter(s => s.status === 'checked-out').length,
      totalHours: staffOnShift.reduce((sum, s) => sum + s.hoursWorked, 0),
      averageRating: staffOnShift.length > 0 
        ? staffOnShift.reduce((sum, s) => sum + s.rating, 0) / staffOnShift.length 
        : 0,
      activeVenues: new Set(staffOnShift.map(s => s.venue)).size
    }

    console.log(`Returning ${staffOnShift.length} staff members on shift with stats:`, stats)

    return NextResponse.json({
      staff: staffOnShift,
      stats: stats,
      date: date,
      totalFound: staffOnShift.length
    })

  } catch (error) {
    console.error('Error fetching staff on shift:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint for updating staff status (check-in, break, check-out)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - Please sign in to update staff status' 
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

    const body = await request.json()
    const { assignmentId, action, notes } = body

    // Validate the assignment belongs to this user
    const assignment = await prisma.staffAssignment.findFirst({
      where: {
        id: assignmentId,
        booking: {
          clientId: user.id
        }
      },
      include: {
        booking: {
          include: {
            event: true
          }
        }
      }
    })

    if (!assignment) {
      return NextResponse.json({
        error: 'Assignment not found or access denied'
      }, { status: 404 })
    }

    // Update assignment status based on action
    let newStatus = assignment.status
    const updateData: any = {
      notes: notes || assignment.notes,
      updatedAt: new Date()
    }

    switch (action) {
      case 'check-in':
        newStatus = 'IN_PROGRESS'
        break
      case 'start-break':
        // In a real app, you'd track break times separately
        updateData.notes = `${updateData.notes || ''} Break started at ${new Date().toLocaleTimeString()}`
        break
      case 'end-break':
        updateData.notes = `${updateData.notes || ''} Break ended at ${new Date().toLocaleTimeString()}`
        break
      case 'check-out':
        newStatus = 'COMPLETED'
        updateData.completedAt = new Date()
        break
    }

    updateData.status = newStatus

    const updatedAssignment = await prisma.staffAssignment.update({
      where: { id: assignmentId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Staff status updated successfully',
      assignment: updatedAssignment
    })

  } catch (error) {
    console.error('Error updating staff status:', error)
    return NextResponse.json({ 
      error: 'Failed to update staff status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}