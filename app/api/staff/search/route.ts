// app/api/staff/search/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SearchParams {
  location: string
  date: string
  startTime: string
  endTime: string
  radius: number
  staffTypes: string[]
  minRating?: number
  maxDistance?: number
  sortBy?: 'distance' | 'rating' | 'rate' | 'experience'
  verified?: boolean
  available?: boolean
  search?: string
  limit?: number
  offset?: number
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Mock geocoding function - replace with actual geocoding service
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // In production, use Google Maps Geocoding API, Mapbox, or similar service
  // For now, return mock coordinates (Toronto downtown area)
  const mockCoordinates = {
    lat: 43.6532 + (Math.random() - 0.5) * 0.1,
    lng: -79.3832 + (Math.random() - 0.5) * 0.1
  }
  return mockCoordinates
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse search parameters
    const params: SearchParams = {
      location: searchParams.get('location') || '',
      date: searchParams.get('date') || '',
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || '',
      radius: parseInt(searchParams.get('radius') || '10'),
      staffTypes: searchParams.get('staffTypes')?.split(',') || [],
      minRating: parseFloat(searchParams.get('minRating') || '0'),
      maxDistance: parseFloat(searchParams.get('maxDistance') || '25'),
      sortBy: (searchParams.get('sortBy') as any) || 'distance',
      verified: searchParams.get('verified') === 'true',
      available: searchParams.get('available') !== 'false', // Default to true
      search: searchParams.get('search') || '',
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    console.log('Staff search params:', params)

    // Validate required parameters
    if (!params.location || !params.date || !params.staffTypes.length) {
      return NextResponse.json({ 
        error: 'Missing required parameters: location, date, and staffTypes' 
      }, { status: 400 })
    }

    // Get coordinates for the search location
    const locationCoords = await geocodeAddress(params.location)
    if (!locationCoords) {
      return NextResponse.json({ 
        error: 'Could not geocode location' 
      }, { status: 400 })
    }

    // Parse event date and time
    const eventDate = new Date(params.date)
    const eventStart = new Date(`${params.date}T${params.startTime}`)
    const eventEnd = new Date(`${params.date}T${params.endTime}`)

    // Check for overnight events
    if (eventEnd < eventStart) {
      eventEnd.setDate(eventEnd.getDate() + 1)
    }

    // Build the base query for staff profiles
    let whereClause: any = {
      staffType: {
        in: params.staffTypes.map(type => type.toUpperCase())
      },
      available: params.available ? true : undefined,
      verified: params.verified ? true : undefined
    }

    // Add rating filter
    if (params.minRating > 0) {
      whereClause.rating = {
        gte: params.minRating
      }
    }

    // Add search filter for name or skills
    if (params.search) {
      whereClause.OR = [
        {
          user: {
            name: {
              contains: params.search,
              mode: 'insensitive'
            }
          }
        },
        {
          bio: {
            contains: params.search,
            mode: 'insensitive'
          }
        },
        {
          skills: {
            hasSome: [params.search]
          }
        }
      ]
    }

    console.log('Base where clause:', JSON.stringify(whereClause, null, 2))

    // Find staff profiles with location data
    let staffProfiles = await prisma.staffProfile.findMany({
      where: whereClause,
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
      },
      take: params.limit,
      skip: params.offset
    })

    console.log(`Found ${staffProfiles.length} staff profiles before filtering`)

    // Check for scheduling conflicts
    const staffIds = staffProfiles.map(profile => profile.id)
    
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
        booking: {
          include: {
            event: true
          }
        }
      }
    })

    console.log(`Found ${conflictingAssignments.length} conflicting assignments`)

    // Create a set of staff IDs that have conflicts
    const conflictingStaffIds = new Set()
    
    conflictingAssignments.forEach(assignment => {
      const eventDate = assignment.booking.event.date
      const eventStartTime = assignment.booking.event.startTime
      const eventEndTime = assignment.booking.event.endTime
      
      // Parse existing booking times
      const existingStart = new Date(`${eventDate.toISOString().split('T')[0]}T${eventStartTime}`)
      let existingEnd = new Date(`${eventDate.toISOString().split('T')[0]}T${eventEndTime}`)
      
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
        conflictingStaffIds.add(assignment.staffId)
      }
    })

    console.log(`${conflictingStaffIds.size} staff have time conflicts`)

    // Filter out staff with conflicts and calculate distances
    const availableStaff = staffProfiles
      .filter(profile => !conflictingStaffIds.has(profile.id))
      .map(profile => {
        // Calculate distance (use mock coordinates if no lat/lng stored)
        const staffLat = profile.latitude || (locationCoords.lat + (Math.random() - 0.5) * 0.2)
        const staffLng = profile.longitude || (locationCoords.lng + (Math.random() - 0.5) * 0.2)
        
        const distance = calculateDistance(
          locationCoords.lat,
          locationCoords.lng,
          staffLat,
          staffLng
        )

        return {
          ...profile,
          distance,
          latitude: staffLat,
          longitude: staffLng
        }
      })
      .filter(profile => profile.distance <= params.maxDistance)

    console.log(`${availableStaff.length} staff within distance range`)

    // Sort the results
    availableStaff.sort((a, b) => {
      switch (params.sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'rate':
          return a.hourlyRate - b.hourlyRate
        case 'experience':
          // Parse years from experience string
          const aYears = parseInt(a.experience?.match(/\d+/)?.[0] || '0')
          const bYears = parseInt(b.experience?.match(/\d+/)?.[0] || '0')
          return bYears - aYears
        case 'distance':
        default:
          return a.distance - b.distance
      }
    })

    // Transform for frontend response
    const transformedStaff = availableStaff.map(profile => ({
      id: profile.id,
      name: profile.user.name || 'Unknown',
      rating: profile.rating,
      experience: profile.experience || `${profile.completedJobs} completed jobs`,
      distance: parseFloat(profile.distance.toFixed(1)),
      profileImg: profile.user.image || `https://api.dicebear.com/7.x/personas/svg?seed=${profile.user.name}`,
      hourlyRate: profile.hourlyRate,
      staffType: profile.staffType,
      available: profile.available,
      bio: profile.bio,
      skills: profile.skills || [],
      verified: profile.verified,
      completedJobs: profile.completedJobs,
      responseTime: Math.random() > 0.5 ? '< 30 mins' : '< 1 hour',
      lastActive: Math.random() > 0.3 ? 'Online now' : 'Active today',
      userId: profile.userId
    }))

    // Get total count for pagination
    const totalCount = await prisma.staffProfile.count({
      where: whereClause
    })

    console.log(`Returning ${transformedStaff.length} staff members`)

    return NextResponse.json({
      staff: transformedStaff,
      total: totalCount,
      filtered: transformedStaff.length,
      searchParams: params
    })

  } catch (error) {
    console.error('Staff search error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint for advanced search with filters
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      location,
      date,
      startTime,
      endTime,
      staffRequirements, // Array of { staffType, quantity, maxRate? }
      filters = {}
    } = body

    // Validate required fields
    if (!location || !date || !startTime || !endTime || !staffRequirements?.length) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Get coordinates
    const locationCoords = await geocodeAddress(location)
    if (!locationCoords) {
      return NextResponse.json({ 
        error: 'Could not geocode location' 
      }, { status: 400 })
    }

    const results = []

    // Search for each staff type requirement
    for (const requirement of staffRequirements) {
      const { staffType, quantity, maxRate } = requirement

      let whereClause: any = {
        staffType: staffType.toUpperCase(),
        available: true,
        verified: filters.verifiedOnly || false
      }

      if (maxRate) {
        whereClause.hourlyRate = { lte: maxRate }
      }

      if (filters.minRating) {
        whereClause.rating = { gte: filters.minRating }
      }

      // Find available staff for this type
      const staffForType = await prisma.staffProfile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        take: quantity * 3 // Get more than needed for selection
      })

      // Filter by conflicts and distance (similar to GET method)
      const availableForType = staffForType.map(profile => {
        const staffLat = profile.latitude || (locationCoords.lat + (Math.random() - 0.5) * 0.2)
        const staffLng = profile.longitude || (locationCoords.lng + (Math.random() - 0.5) * 0.2)
        
        const distance = calculateDistance(
          locationCoords.lat,
          locationCoords.lng,
          staffLat,
          staffLng
        )

        return {
          ...profile,
          distance,
          transformedData: {
            id: profile.id,
            name: profile.user.name || 'Unknown',
            rating: profile.rating,
            experience: profile.experience || `${profile.completedJobs} completed jobs`,
            distance: parseFloat(distance.toFixed(1)),
            profileImg: profile.user.image || `https://api.dicebear.com/7.x/personas/svg?seed=${profile.user.name}`,
            hourlyRate: profile.hourlyRate,
            staffType: profile.staffType,
            available: profile.available,
            bio: profile.bio,
            skills: profile.skills || [],
            verified: profile.verified,
            completedJobs: profile.completedJobs,
            responseTime: Math.random() > 0.5 ? '< 30 mins' : '< 1 hour',
            lastActive: Math.random() > 0.3 ? 'Online now' : 'Active today',
            userId: profile.userId
          }
        }
      })
      .filter(profile => profile.distance <= (filters.maxDistance || 25))
      .sort((a, b) => a.distance - b.distance)

      results.push({
        staffType,
        requested: quantity,
        available: availableForType.length,
        staff: availableForType.map(p => p.transformedData).slice(0, quantity * 2)
      })
    }

    return NextResponse.json({
      location: location,
      coordinates: locationCoords,
      eventDetails: { date, startTime, endTime },
      staffResults: results,
      totalAvailable: results.reduce((sum, r) => sum + r.available, 0)
    })

  } catch (error) {
    console.error('Advanced staff search error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}