// app/api/staff/search/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Map frontend staff types to database enum values
const mapStaffType = (frontendType: string) => {
  const mapping: { [key: string]: string } = {
    'bartender': 'BARTENDER',
    'server': 'SERVER', 
    'barback': 'BARBACK',
    'event-crew': 'EVENT_CREW'
  }
  return mapping[frontendType] || frontendType.toUpperCase()
}

export async function POST(request: Request) {
  try {
    const { location, date, startTime, endTime, staffRequests, radius } = await request.json()

    console.log('Searching for staff with:', { location, date, staffRequests, radius })

    // Find available staff for each requested type
    const availableStaff = await Promise.all(
      staffRequests.map(async (request: any) => {
        const staffType = mapStaffType(request.type)
        
        console.log(`Searching for ${staffType} staff...`)
        
        const staff = await prisma.staffProfile.findMany({
          where: {
            staffType: staffType as any,
            available: true,
            verified: true,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          take: Math.max(request.quantity + 2, 5) // Get extra options
        })

        console.log(`Found ${staff.length} ${staffType} staff members`)

        return {
          type: request.type,
          quantity: request.quantity,
          staff: staff.map(s => ({
            id: s.id,
            name: s.user.name || 'Unknown',
            rating: s.rating || 4.5,
            experience: s.experience || 'Experienced professional',
            hourlyRate: s.hourlyRate || 25,
            profileImg: `https://api.dicebear.com/7.x/personas/svg?seed=${s.user.name}`,
            distance: Math.random() * (radius || 10) + 0.5 // Mock distance - replace with real geolocation
          }))
        }
      })
    )

    console.log('Search completed:', availableStaff)

    return NextResponse.json({ availableStaff })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search staff',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}