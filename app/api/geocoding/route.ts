// app/api/geocoding/route.ts
import { NextResponse } from 'next/server'

interface GeocodingResult {
  latitude: number
  longitude: number
  formattedAddress: string
}

// Mock coordinates for demo purposes
const mockCoordinates: Record<string, GeocodingResult> = {
  'new york': { latitude: 40.7128, longitude: -74.0060, formattedAddress: 'New York, NY, USA' },
  'los angeles': { latitude: 34.0522, longitude: -118.2437, formattedAddress: 'Los Angeles, CA, USA' },
  'chicago': { latitude: 41.8781, longitude: -87.6298, formattedAddress: 'Chicago, IL, USA' },
  'houston': { latitude: 29.7604, longitude: -95.3698, formattedAddress: 'Houston, TX, USA' },
  'phoenix': { latitude: 33.4484, longitude: -112.0740, formattedAddress: 'Phoenix, AZ, USA' },
  'philadelphia': { latitude: 39.9526, longitude: -75.1652, formattedAddress: 'Philadelphia, PA, USA' },
  'san antonio': { latitude: 29.4241, longitude: -98.4936, formattedAddress: 'San Antonio, TX, USA' },
  'san diego': { latitude: 32.7157, longitude: -117.1611, formattedAddress: 'San Diego, CA, USA' },
  'dallas': { latitude: 32.7767, longitude: -96.7970, formattedAddress: 'Dallas, TX, USA' },
  'san jose': { latitude: 37.3382, longitude: -121.8863, formattedAddress: 'San Jose, CA, USA' },
  'austin': { latitude: 30.2672, longitude: -97.7431, formattedAddress: 'Austin, TX, USA' },
  'jacksonville': { latitude: 30.3322, longitude: -81.6557, formattedAddress: 'Jacksonville, FL, USA' },
  'fort worth': { latitude: 32.7555, longitude: -97.3308, formattedAddress: 'Fort Worth, TX, USA' },
  'columbus': { latitude: 39.9612, longitude: -82.9988, formattedAddress: 'Columbus, OH, USA' },
  'charlotte': { latitude: 35.2271, longitude: -80.8431, formattedAddress: 'Charlotte, NC, USA' },
  'seattle': { latitude: 47.6062, longitude: -122.3321, formattedAddress: 'Seattle, WA, USA' },
  'denver': { latitude: 39.7392, longitude: -104.9903, formattedAddress: 'Denver, CO, USA' },
  'boston': { latitude: 42.3601, longitude: -71.0589, formattedAddress: 'Boston, MA, USA' },
  'nashville': { latitude: 36.1627, longitude: -86.7816, formattedAddress: 'Nashville, TN, USA' },
  'baltimore': { latitude: 39.2904, longitude: -76.6122, formattedAddress: 'Baltimore, MD, USA' },
  'oklahoma city': { latitude: 35.4676, longitude: -97.5164, formattedAddress: 'Oklahoma City, OK, USA' },
  'portland': { latitude: 45.5152, longitude: -122.6784, formattedAddress: 'Portland, OR, USA' },
  'las vegas': { latitude: 36.1699, longitude: -115.1398, formattedAddress: 'Las Vegas, NV, USA' },
  'milwaukee': { latitude: 43.0389, longitude: -87.9065, formattedAddress: 'Milwaukee, WI, USA' },
  'albuquerque': { latitude: 35.0844, longitude: -106.6504, formattedAddress: 'Albuquerque, NM, USA' },
  'tucson': { latitude: 32.2226, longitude: -110.9747, formattedAddress: 'Tucson, AZ, USA' },
  'fresno': { latitude: 36.7378, longitude: -119.7871, formattedAddress: 'Fresno, CA, USA' },
  'sacramento': { latitude: 38.5816, longitude: -121.4944, formattedAddress: 'Sacramento, CA, USA' },
  'mesa': { latitude: 33.4152, longitude: -111.8315, formattedAddress: 'Mesa, AZ, USA' },
  'kansas city': { latitude: 39.0997, longitude: -94.5786, formattedAddress: 'Kansas City, MO, USA' },
  'atlanta': { latitude: 33.7490, longitude: -84.3880, formattedAddress: 'Atlanta, GA, USA' },
  'miami': { latitude: 25.7617, longitude: -80.1918, formattedAddress: 'Miami, FL, USA' },
  'raleigh': { latitude: 35.7796, longitude: -78.6382, formattedAddress: 'Raleigh, NC, USA' },
  'omaha': { latitude: 41.2524, longitude: -95.9980, formattedAddress: 'Omaha, NE, USA' },
  'miami beach': { latitude: 25.7907, longitude: -80.1300, formattedAddress: 'Miami Beach, FL, USA' },
  'virginia beach': { latitude: 36.8529, longitude: -75.9780, formattedAddress: 'Virginia Beach, VA, USA' }
}

async function geocodeWithGoogleMaps(address: string): Promise<GeocodingResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.log('Google Maps API key not found, using mock data')
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address
      }
    }
    
    return null
  } catch (error) {
    console.error('Google Maps geocoding error:', error)
    return null
  }
}

function geocodeWithMockData(address: string): GeocodingResult | null {
  const normalizedAddress = address.toLowerCase()
  
  // Try exact matches first
  for (const [city, coords] of Object.entries(mockCoordinates)) {
    if (normalizedAddress.includes(city)) {
      return coords
    }
  }
  
  // Try partial matches for common patterns
  const patterns = [
    /(\w+)\s+(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane)/i,
    /\d+\s+\w+/i, // Street numbers
    /downtown|center|central/i
  ]
  
  for (const pattern of patterns) {
    if (pattern.test(address)) {
      // If it looks like a real address, default to NYC coordinates
      return mockCoordinates['new york']
    }
  }
  
  return null
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    if (!address || typeof address !== 'string') {
      return NextResponse.json({ 
        error: 'Address is required' 
      }, { status: 400 })
    }

    console.log('Geocoding address:', address)

    // Try Google Maps API first
    let result = await geocodeWithGoogleMaps(address)
    
    // Fall back to mock data if Google Maps fails
    if (!result) {
      result = geocodeWithMockData(address)
    }

    if (!result) {
      return NextResponse.json({ 
        error: 'Could not geocode address' 
      }, { status: 404 })
    }

    console.log('Geocoding result:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ 
        error: 'Address parameter is required' 
      }, { status: 400 })
    }

    console.log('Geocoding address via GET:', address)

    // Try Google Maps API first
    let result = await geocodeWithGoogleMaps(address)
    
    // Fall back to mock data if Google Maps fails
    if (!result) {
      result = geocodeWithMockData(address)
    }

    if (!result) {
      return NextResponse.json({ 
        error: 'Could not geocode address' 
      }, { status: 404 })
    }

    console.log('Geocoding result:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}