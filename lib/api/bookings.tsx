// lib/api/bookings.ts
export interface UpdateBookingData {
  eventTitle?: string
  venue?: string
  date?: string
  startTime?: string
  endTime?: string
  specialInstructions?: string
  guestCount?: number
}

export interface SendMessageData {
  staffId: string
  message: string
}

export interface SubmitRatingData {
  staffId: string
  rating: number
  review?: string
}

export class BookingAPI {
  private static baseUrl = '/api/bookings'

  static async getMyBookings() {
    const response = await fetch(`${this.baseUrl}/my-bookings`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch bookings')
    }
    
    return response.json()
  }

  static async updateBooking(bookingId: string, data: UpdateBookingData) {
    const response = await fetch(`${this.baseUrl}/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update booking')
    }

    return response.json()
  }

  static async deleteBooking(bookingId: string) {
    const response = await fetch(`${this.baseUrl}/${bookingId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete booking')
    }

    return response.json()
  }

  static async sendMessage(bookingId: string, data: SendMessageData) {
    const response = await fetch(`${this.baseUrl}/${bookingId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send message')
    }

    return response.json()
  }

  static async getMessages(bookingId: string, staffId?: string) {
    const url = new URL(`${window.location.origin}${this.baseUrl}/${bookingId}/messages`)
    if (staffId) {
      url.searchParams.set('staffId', staffId)
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch messages')
    }

    return response.json()
  }

  static async submitRating(bookingId: string, data: SubmitRatingData) {
    const response = await fetch(`${this.baseUrl}/${bookingId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit rating')
    }

    return response.json()
  }

  static async getRatings(bookingId: string) {
    const response = await fetch(`${this.baseUrl}/${bookingId}/ratings`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch ratings')
    }

    return response.json()
  }
}

// Error handling utility
export class BookingAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'BookingAPIError'
  }
}

// Response type definitions
export interface BookingResponse {
  bookings: Booking[]
  message: string
}

export interface MessageResponse {
  message: string
  messageId: string
  timestamp: Date
}

export interface RatingResponse {
  message: string
  rating: any
  newAverageRating: number
}

interface Booking {
  id: string
  eventTitle: string
  venue: string
  date: string
  startTime: string
  endTime: string
  status: string
  totalCost: number
  platformFee: number
  subtotal: number
  guestCount?: number
  specialInstructions?: string
  eventType?: string
  duration?: string
  staffMembers: StaffMember[]
}

interface StaffMember {
  id: string
  name: string
  role: string
  hourlyRate: number
  status: string
  profileImg: string
  phone: string
  email: string
  rating: number
  experience: string
  lastMessage?: string
  messageTime?: string
  canRate?: boolean
  myRating?: number
  bio?: string
  skills?: string[]
  availability?: string
}