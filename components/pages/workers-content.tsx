"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight,
  Star,
  CheckCircle,
  CreditCard,
  Coffee,
  Utensils,
  Package,
  Headphones,
  MessageSquare,
  Edit,
  Minus,
  Plus,
  Loader2,
  Briefcase,
  Building2,
  AlertCircle,
  DollarSign,
  Shield,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  SlidersHorizontal
} from 'lucide-react'

interface StaffType {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  rate: number
}

interface StaffMember {
  id: string
  name: string
  rating: number
  experience: string
  distance: number
  profileImg: string
  hourlyRate: number
  staffType: string
  available: boolean
  bio?: string
  skills?: string[]
  verified: boolean
  completedJobs: number
  responseTime: string
  lastActive: string
  selected?: boolean
}

interface StaffRequest {
  type: string
  quantity: number
}

interface BookingDetails {
  jobTitle: string
  jobType: 'event' | 'shift' | 'catering'
  venue: string
  location: string
  date: string
  startTime: string
  endTime: string
  radius: number
  staffRequests: StaffRequest[]
  description?: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand?: string
  isDefault: boolean
}

interface SearchFilters {
  minRating: number
  maxDistance: number
  sortBy: 'distance' | 'rating' | 'rate' | 'experience'
  verified: boolean
  available: boolean
}

const staffTypes: StaffType[] = [
  { id: 'BARTENDER', name: 'Bartender', icon: Coffee, rate: 18},
  { id: 'SERVER', name: 'Server', icon: Utensils, rate: 18 },
  { id: 'BARBACK', name: 'Barback', icon: Package, rate: 18 },
  { id: 'EVENT_CREW', name: 'Event Crew', icon: Headphones, rate: 20 }
]

const jobTypes = [
  { id: 'event', label: 'Private Event', icon: Users },
  { id: 'shift', label: 'Bar/Restaurant Shift', icon: Building2 },
  { id: 'catering', label: 'Catering Job', icon: Briefcase }
]

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
  { id: '2', type: 'card', last4: '1234', brand: 'Mastercard', isDefault: false }
]

export default function EnhancedStaffSelection() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([])
  const [selectedStaff, setSelectedStaff] = useState<StaffMember[]>([])
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(mockPaymentMethods[0].id)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    minRating: 0,
    maxDistance: 25,
    sortBy: 'distance',
    verified: false,
    available: true
  })

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    jobTitle: '',
    jobType: 'event',
    venue: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    radius: 10,
    staffRequests: [],
    description: ''
  })

  // Calculate hours with proper validation
  const calculateHours = () => {
    if (!bookingDetails.startTime || !bookingDetails.endTime) return 0
    
    const start = new Date(`2000-01-01T${bookingDetails.startTime}:00`)
    const end = new Date(`2000-01-01T${bookingDetails.endTime}:00`)
    
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    
    // Handle overnight shifts
    if (hours <= 0) {
      hours += 24
    }
    
    // Minimum 2 hours
    return Math.max(hours, 2)
  }

  const hours = calculateHours()
  const isValidTimeRange = hours >= 2

  const updateStaffQuantity = (staffId: string, change: number) => {
    const currentRequest = bookingDetails.staffRequests.find(r => r.type === staffId)
    const currentQuantity = currentRequest?.quantity || 0
    const newQuantity = Math.max(0, Math.min(10, currentQuantity + change))

    if (newQuantity === 0) {
      setBookingDetails({
        ...bookingDetails,
        staffRequests: bookingDetails.staffRequests.filter(r => r.type !== staffId)
      })
    } else if (currentRequest) {
      setBookingDetails({
        ...bookingDetails,
        staffRequests: bookingDetails.staffRequests.map(r => 
          r.type === staffId ? {...r, quantity: newQuantity} : r
        )
      })
    } else {
      setBookingDetails({
        ...bookingDetails,
        staffRequests: [...bookingDetails.staffRequests, {type: staffId, quantity: newQuantity}]
      })
    }
  }

  const searchStaff = async (refreshSearch = false) => {
    setSearchLoading(true)
    try {
      // API call to search for staff
      const searchParams = new URLSearchParams({
        location: bookingDetails.location,
        date: bookingDetails.date,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        radius: bookingDetails.radius.toString(),
        staffTypes: bookingDetails.staffRequests.map(r => r.type).join(','),
        minRating: searchFilters.minRating.toString(),
        maxDistance: searchFilters.maxDistance.toString(),
        sortBy: searchFilters.sortBy,
        verified: searchFilters.verified.toString(),
        available: searchFilters.available.toString()
      })

      if (searchQuery) {
        searchParams.append('search', searchQuery)
      }

      const response = await fetch(`/api/staff/search?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to search staff')
      }

      const data = await response.json()
      
      // Generate mock data that matches your database structure
      const mockStaff: StaffMember[] = []
      
      for (const request of bookingDetails.staffRequests) {
        const staffType = staffTypes.find(t => t.id === request.type)
        if (!staffType) continue
        
        for (let i = 0; i < Math.max(request.quantity * 3, 8); i++) {
          mockStaff.push({
            id: `staff_${request.type}_${i}`,
            name: `${staffType.name} ${i + 1}`,
            rating: 4.0 + Math.random() * 1.0,
            experience: `${2 + Math.floor(Math.random() * 8)} years`,
            distance: Math.random() * bookingDetails.radius,
            profileImg: `https://api.dicebear.com/7.x/personas/svg?seed=${request.type}${i}`,
            hourlyRate: staffType.rate + Math.floor(Math.random() * 10) - 5,
            staffType: request.type,
            available: Math.random() > 0.1,
            bio: `Experienced ${staffType.name.toLowerCase()} with expertise in ${bookingDetails.jobType} events.`,
            skills: ['Professional Service', 'Team Player', 'Punctual', 'Flexible'],
            verified: Math.random() > 0.3,
            completedJobs: Math.floor(Math.random() * 100) + 10,
            responseTime: Math.random() > 0.5 ? '< 1 hour' : '< 30 mins',
            lastActive: Math.random() > 0.5 ? 'Online now' : 'Active today',
            selected: false
          })
        }
      }

      // Apply filters
      let filteredStaff = mockStaff.filter(staff => {
        if (searchFilters.minRating > 0 && staff.rating < searchFilters.minRating) return false
        if (staff.distance > searchFilters.maxDistance) return false
        if (searchFilters.verified && !staff.verified) return false
        if (searchFilters.available && !staff.available) return false
        if (searchQuery && !staff.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
      })

      // Apply sorting
      filteredStaff.sort((a, b) => {
        switch (searchFilters.sortBy) {
          case 'rating':
            return b.rating - a.rating
          case 'rate':
            return a.hourlyRate - b.hourlyRate
          case 'experience':
            return parseInt(b.experience) - parseInt(a.experience)
          case 'distance':
          default:
            return a.distance - b.distance
        }
      })

      setAvailableStaff(filteredStaff)
      if (!refreshSearch) {
        setStep(2)
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to search for staff. Please try again.')
    } finally {
      setSearchLoading(false)
    }
  }

  const toggleStaffSelection = (staff: StaffMember) => {
    const isSelected = selectedStaff.some(s => s.id === staff.id)
    
    if (isSelected) {
      setSelectedStaff(selectedStaff.filter(s => s.id !== staff.id))
    } else {
      // Check if we can add more staff of this type
      const staffTypeRequest = bookingDetails.staffRequests.find(r => r.type === staff.staffType)
      const currentSelectedOfType = selectedStaff.filter(s => s.staffType === staff.staffType).length
      
      if (staffTypeRequest && currentSelectedOfType < staffTypeRequest.quantity) {
        setSelectedStaff([...selectedStaff, staff])
      } else {
        alert(`You can only select ${staffTypeRequest?.quantity || 0} ${staff.staffType.toLowerCase()}(s)`)
      }
    }
  }

  const proceedToPayment = () => {
    // Validate that we have selected the right number of staff
    const requiredStaff = bookingDetails.staffRequests.reduce((sum, req) => sum + req.quantity, 0)
    
    if (selectedStaff.length !== requiredStaff) {
      alert(`Please select exactly ${requiredStaff} staff members`)
      return
    }

    setStep(3)
  }

  const processPayment = async () => {
    setLoading(true)
    try {
      // Prepare event details for API
      const eventDetails = {
        title: bookingDetails.jobTitle,
        description: bookingDetails.description,
        venue: bookingDetails.venue,
        address: bookingDetails.location,
        date: bookingDetails.date,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        eventType: bookingDetails.jobType,
        guestCount: null
      }

      // Prepare selected staff for API
      const selectedStaffData = selectedStaff.map(staff => ({
        staffId: staff.id,
        hourlyRate: staff.hourlyRate,
        staffType: staff.staffType
      }))

      // Prepare requirements
      const requirements = bookingDetails.staffRequests.map(req => ({
        staffType: req.type,
        quantity: req.quantity,
        hourlyRate: staffTypes.find(t => t.id === req.type)?.rate || 0
      }))

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventDetails,
          selectedStaff: selectedStaffData,
          requirements
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setBookingId(data.booking.id)
        setStep(4)
      } else {
        const error = await response.json()
        console.error('Failed to create booking:', error)
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Network error during payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderRequestStep = () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Book Professional Staff</h1>
        <p className="text-gray-600">Fill out your job details and we'll match you with qualified professionals</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Job Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-900">What type of job is this?</label>
          <div className="grid grid-cols-3 gap-3">
            {jobTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setBookingDetails({...bookingDetails, jobType: type.id as any})}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    bookingDetails.jobType === type.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${
                    bookingDetails.jobType === type.id ? 'text-orange-600' : 'text-gray-500'
                  }`} />
                  <span className={`text-xs font-medium ${
                    bookingDetails.jobType === type.id ? 'text-orange-700' : 'text-gray-600'
                  }`}>
                    {type.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Job Title */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-gray-900">Job Title</label>
          <input
            type="text"
            placeholder={bookingDetails.jobType === 'shift' ? 'e.g., Weekend Bar Shift' : 'e.g., Wedding Reception Service'}
            value={bookingDetails.jobTitle}
            onChange={(e) => setBookingDetails({...bookingDetails, jobTitle: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Venue and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              {bookingDetails.jobType === 'shift' ? 'Business Name' : 'Venue Name'}
            </label>
            <input
              type="text"
              placeholder={bookingDetails.jobType === 'shift' ? 'Restaurant/Bar name' : 'Venue name'}
              value={bookingDetails.venue}
              onChange={(e) => setBookingDetails({...bookingDetails, venue: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Street address"
                value={bookingDetails.location}
                onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Start Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={bookingDetails.startTime}
                onChange={(e) => setBookingDetails({...bookingDetails, startTime: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="">Select start time</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2)
                  const minute = i % 2 === 0 ? '00' : '30'
                  const time24 = `${hour.toString().padStart(2, '0')}:${minute}`
                  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                  const ampm = hour < 12 ? 'AM' : 'PM'
                  const display = `${hour12}:${minute} ${ampm}`
                  return (
                    <option key={i} value={time24}>
                      {display}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">End Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={bookingDetails.endTime}
                onChange={(e) => setBookingDetails({...bookingDetails, endTime: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="">Select end time</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2)
                  const minute = i % 2 === 0 ? '00' : '30'
                  const time24 = `${hour.toString().padStart(2, '0')}:${minute}`
                  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                  const ampm = hour < 12 ? 'AM' : 'PM'
                  const display = `${hour12}:${minute} ${ampm}`
                  return (
                    <option key={i} value={time24}>
                      {display}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Time validation warning */}
        {(bookingDetails.startTime && bookingDetails.endTime && !isValidTimeRange) && (
          <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Minimum booking duration is 2 hours. Duration will be adjusted to 2 hours.
              </span>
            </div>
          </div>
        )}

        {/* Duration display */}
        {bookingDetails.startTime && bookingDetails.endTime && (
          <div className="mb-5 text-center">
            <span className="text-sm text-gray-600">
              Duration: <span className="font-semibold text-gray-900">{hours.toFixed(1)} hours</span>
            </span>
          </div>
        )}

        {/* Search Radius */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-900">
            Search within {bookingDetails.radius} miles
          </label>
          <input
            type="range"
            min="1"
            max="25"
            value={bookingDetails.radius}
            onChange={(e) => setBookingDetails({...bookingDetails, radius: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #f97316 ${(bookingDetails.radius / 25) * 100}%, #e5e7eb ${(bookingDetails.radius / 25) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 mi</span>
            <span>25 mi</span>
          </div>
        </div>

        {/* Staff Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-900">Staff needed</label>
          <div className="space-y-3">
            {staffTypes.map((staffType) => {
              const Icon = staffType.icon
              const currentRequest = bookingDetails.staffRequests.find(r => r.type === staffType.id)
              const quantity = currentRequest?.quantity || 0

              return (
                <div key={staffType.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{staffType.name}</div>
                      <div className="text-gray-600 text-xs">${staffType.rate}/hour</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStaffQuantity(staffType.id, -1)}
                      disabled={quantity === 0}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => updateStaffQuantity(staffType.id, 1)}
                      disabled={quantity >= 10}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-900">
            Additional Details (Optional)
          </label>
          <textarea
            placeholder="Any special requirements, dress code, or additional information..."
            value={bookingDetails.description}
            onChange={(e) => setBookingDetails({...bookingDetails, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>

        <button
          onClick={() => searchStaff()}
          disabled={
            loading || 
            !bookingDetails.jobTitle.trim() || 
            !bookingDetails.venue.trim() || 
            !bookingDetails.location.trim() || 
            !bookingDetails.date || 
            !bookingDetails.startTime || 
            !bookingDetails.endTime || 
            bookingDetails.staffRequests.length === 0
          }
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              Find Available Staff
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStaffSelectionStep = () => {
    const totalNeeded = bookingDetails.staffRequests.reduce((sum, req) => sum + req.quantity, 0)
    const totalSelected = selectedStaff.length
    
    const groupedStaff = availableStaff.reduce((groups, staff) => {
      if (!groups[staff.staffType]) {
        groups[staff.staffType] = []
      }
      groups[staff.staffType].push(staff)
      return groups
    }, {} as Record<string, StaffMember[]>)
    
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{bookingDetails.jobTitle}</h1>
            <p className="text-gray-600">
              Select {totalNeeded} professionals for {new Date(bookingDetails.date).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500">
                {totalSelected} of {totalNeeded} selected
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(totalSelected / totalNeeded) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit Details
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, skills, or experience..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={searchFilters.sortBy}
                onChange={(e) => setSearchFilters({...searchFilters, sortBy: e.target.value as any})}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="rate">Sort by Rate (Low to High)</option>
                <option value="experience">Sort by Experience</option>
              </select>
              
              <button
                onClick={() => searchStaff(true)}
                disabled={searchLoading}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${searchLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min Rating</label>
                  <select
                    value={searchFilters.minRating}
                    onChange={(e) => setSearchFilters({...searchFilters, minRating: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Distance</label>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={searchFilters.maxDistance}
                    onChange={(e) => setSearchFilters({...searchFilters, maxDistance: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">{searchFilters.maxDistance} miles</div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={searchFilters.verified}
                      onChange={(e) => setSearchFilters({...searchFilters, verified: e.target.checked})}
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    Verified Only
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={searchFilters.available}
                      onChange={(e) => setSearchFilters({...searchFilters, available: e.target.checked})}
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    Available Only
                  </label>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => searchStaff(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Staff Categories */}
        <div className="space-y-8">
          {Object.entries(groupedStaff).map(([staffType, staffList]) => {
            const typeInfo = staffTypes.find(t => t.id === staffType)
            const Icon = typeInfo?.icon || Users
            const neededForType = bookingDetails.staffRequests.find(r => r.type === staffType)?.quantity || 0
            const selectedForType = selectedStaff.filter(s => s.staffType === staffType).length

            return (
              <div key={staffType} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {typeInfo?.name}s
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Select {neededForType} • {selectedForType} selected • ${typeInfo?.rate}/hour
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{staffList.length} available</div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(selectedForType / neededForType) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffList.map((staff) => {
                    const isSelected = selectedStaff.some(s => s.id === staff.id)
                    const canSelect = selectedForType < neededForType || isSelected
                    
                    return (
                      <div 
                        key={staff.id} 
                        className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-orange-500 bg-orange-50' 
                            : canSelect
                              ? 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                              : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => canSelect && toggleStaffSelection(staff)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">{staff.name}</h4>
                                {staff.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{staff.experience}</p>
                              <div className="flex items-center gap-1 mb-2">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{staff.rating.toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({staff.completedJobs} jobs)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-500' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <UserCheck className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-xs font-medium text-gray-900">${staff.hourlyRate}/hr</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{staff.distance.toFixed(1)} mi away</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${
                                staff.available ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <span className={`font-medium ${
                                staff.available ? 'text-green-700' : 'text-gray-500'
                              }`}>
                                {staff.available ? 'Available' : 'Busy'}
                              </span>
                            </div>
                          </div>
                          
                          {staff.bio && (
                            <p className="text-xs text-gray-600 line-clamp-2">{staff.bio}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Response: {staff.responseTime}</span>
                            <span className="text-gray-500">{staff.lastActive}</span>
                          </div>
                          
                          {staff.skills && staff.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {staff.skills.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                                  {skill}
                                </Badge>
                              ))}
                              {staff.skills.length > 2 && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                  +{staff.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {staffList.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No {typeInfo?.name.toLowerCase()}s found matching your criteria</p>
                    <button
                      onClick={() => {
                        setSearchFilters({
                          minRating: 0,
                          maxDistance: 25,
                          sortBy: 'distance',
                          verified: false,
                          available: true
                        })
                        searchStaff(true)
                      }}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                    >
                      Expand search criteria
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="font-semibold text-gray-900">
                {totalSelected} of {totalNeeded} staff selected
              </div>
              <div className="text-sm text-gray-600">
                {totalSelected < totalNeeded && `Select ${totalNeeded - totalSelected} more to continue`}
                {totalSelected === totalNeeded && 'Ready to proceed to payment'}
                {totalSelected > totalNeeded && 'Too many staff selected'}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedStaff([])}
                disabled={selectedStaff.length === 0}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Selection
              </button>
              
              <button
                onClick={proceedToPayment}
                disabled={totalSelected !== totalNeeded}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPaymentStep = () => {
    const subtotal = selectedStaff.reduce((sum, staff) => sum + staff.hourlyRate * hours, 0)
    const platformFee = subtotal * 0.15
    const total = subtotal + platformFee

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review & Payment</h1>
          <p className="text-gray-600">Confirm your booking and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Job Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title</span>
                  <span className="font-medium text-gray-900">{bookingDetails.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-900">
                    {jobTypes.find(t => t.id === bookingDetails.jobType)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium text-gray-900">{bookingDetails.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">{new Date(bookingDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-900">{bookingDetails.startTime} - {bookingDetails.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">{hours.toFixed(1)} hours</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Selected Staff</h3>
              <div className="space-y-3">
                {selectedStaff.map((staff) => {
                  const staffType = staffTypes.find(t => t.id === staff.staffType)
                  const Icon = staffType?.icon || Users
                  return (
                    <div key={staff.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{staff.name}</div>
                          <div className="text-gray-600 text-xs">{staffType?.name} • {staff.rating.toFixed(1)} ★</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 text-sm">${staff.hourlyRate}/hr</div>
                        <div className="text-gray-600 text-xs">${(staff.hourlyRate * hours).toFixed(2)} total</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                {mockPaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={method.id}
                      name="payment"
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {method.brand} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </label>
                  </div>
                ))}
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  + Add new payment method
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
              <div className="space-y-3 text-sm">
                {selectedStaff.map((staff) => {
                  const cost = staff.hourlyRate * hours
                  return (
                    <div key={staff.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {staff.name} × {hours.toFixed(1)}h
                      </span>
                      <span className="font-medium text-gray-900">${cost.toFixed(2)}</span>
                    </div>
                  )
                })}
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform fee (15%)</span>
                    <span className="font-medium text-gray-900">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-orange-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">Payment Protection</h4>
                  <p className="text-sm text-orange-800">
                    Your payment is protected. You'll only be charged after staff confirm availability.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={processPayment}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Pay ${total.toFixed(2)} & Confirm Booking
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By clicking "Pay & Confirm", you agree to our Terms of Service and acknowledge our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderSuccessStep = () => (
    <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Your booking has been confirmed and selected staff have been notified.
      </p>
      
      {bookingId && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="text-center">
            <p className="text-sm text-gray-600">Booking ID</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{bookingId}</p>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">What's next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-gray-700 text-sm">Selected staff will confirm within 2 hours</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageSquare className="w-3 h-3 text-orange-600" />
            </div>
            <span className="text-gray-700 text-sm">Message your team through your dashboard</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-gray-700 text-sm">Staff will arrive 15 minutes early</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => window.location.href = '/bookings'}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          View My Bookings
        </button>
        <button
          onClick={() => {
            setStep(1)
            setBookingId(null)
            setAvailableStaff([])
            setSelectedStaff([])
            setBookingDetails({
              jobTitle: '',
              jobType: 'event',
              venue: '',
              location: '',
              date: '',
              startTime: '',
              endTime: '',
              radius: 10,
              staffRequests: [],
              description: ''
            })
          }}
          className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Book Another Job
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Progress Steps */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-center">
            {['Details', 'Staff', 'Payment', 'Complete'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    step > index + 1 ? 'bg-green-500 text-white' :
                    step === index + 1 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step > index + 1 ? <CheckCircle className="w-3 h-3" /> : index + 1}
                  </div>
                  <span className={`ml-2 text-xs font-medium ${
                    step === index + 1 ? 'text-orange-600' : 
                    step > index + 1 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-px mx-3 transition-colors ${
                    step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6 px-4 sm:px-6">
        {step === 1 && renderRequestStep()}
        {step === 2 && renderStaffSelectionStep()}
        {step === 3 && renderPaymentStep()}
        {step === 4 && renderSuccessStep()}
      </div>
    </div>
  )
}