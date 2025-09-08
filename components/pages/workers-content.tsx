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
  Shield
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

const staffTypes: StaffType[] = [
  { id: 'bartender', name: 'Bartender', icon: Coffee, rate: 35 },
  { id: 'server', name: 'Server', icon: Utensils, rate: 25 },
  { id: 'barback', name: 'Barback', icon: Package, rate: 20 },
  { id: 'event-crew', name: 'Event Crew', icon: Headphones, rate: 22 }
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

export default function ImprovedStaffHiring() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [availableStaff, setAvailableStaff] = useState<any[]>([])
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(mockPaymentMethods[0].id)
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

  const searchStaff = async () => {
    setLoading(true)
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock available staff data
      const mockStaff = bookingDetails.staffRequests.map(request => ({
        type: request.type,
        quantity: request.quantity,
        staff: Array.from({ length: Math.max(request.quantity, 5) }, (_, i) => ({
          id: `${request.type}-${i}`,
          name: `${request.type.charAt(0).toUpperCase() + request.type.slice(1)} ${i + 1}`,
          rating: 4.2 + Math.random() * 0.8,
          experience: `${2 + Math.floor(Math.random() * 8)} years experience`,
          distance: Math.random() * bookingDetails.radius,
          profileImg: `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face`,
          hourlyRate: staffTypes.find(t => t.id === request.type)?.rate || 25
        }))
      }))
      
      setAvailableStaff(mockStaff)
      setStep(2)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const proceedToPayment = () => {
    setStep(3)
  }

  const processPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: bookingDetails.jobTitle,
          jobType: bookingDetails.jobType,
          venue: bookingDetails.venue,
          location: bookingDetails.location,
          date: bookingDetails.date,
          startTime: bookingDetails.startTime,
          endTime: bookingDetails.endTime,
          description: bookingDetails.description,
          staffRequests: bookingDetails.staffRequests.map(req => ({
            type: req.type,
            quantity: req.quantity,
            hourlyRate: staffTypes.find(t => t.id === req.type)?.rate || 0
          })),
          clientId: 'temp-client-id' // This will be replaced with actual auth
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setBookingId(data.bookingId)
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
            <label className="block text-sm font-medium mb-2 text-gray-900">Start</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={bookingDetails.startTime}
                onChange={(e) => setBookingDetails({...bookingDetails, startTime: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">End</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={bookingDetails.endTime}
                onChange={(e) => setBookingDetails({...bookingDetails, endTime: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
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
          onClick={searchStaff}
          disabled={loading || !bookingDetails.jobTitle || !bookingDetails.venue || !bookingDetails.location || !bookingDetails.date || !bookingDetails.startTime || !bookingDetails.endTime || bookingDetails.staffRequests.length === 0}
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

  const renderMatchStep = () => {
    const totalStaff = bookingDetails.staffRequests.reduce((sum, req) => sum + req.quantity, 0)
    
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{bookingDetails.jobTitle}</h1>
            <p className="text-gray-600">
              {totalStaff} professionals available for {new Date(bookingDetails.date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </button>
        </div>

        <div className="space-y-6">
          {availableStaff.map((staffGroup) => {
            const staffType = staffTypes.find(t => t.id === staffGroup.type)
            const Icon = staffType?.icon || Users

            return (
              <div key={staffGroup.type} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {staffGroup.quantity} {staffType?.name}(s)
                    </h3>
                    <p className="text-gray-600 text-sm">${staffType?.rate}/hour each</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffGroup.staff.slice(0, staffGroup.quantity).map((staff: StaffMember, index: number) => (
                    <div key={staff.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                          {staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{staff.name}</h4>
                          <p className="text-xs text-gray-600 mb-1">{staff.experience}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{staff.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{staff.distance.toFixed(1)} mi away</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 font-medium">Available</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={proceedToPayment}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const renderPaymentStep = () => {
    const subtotal = bookingDetails.staffRequests.reduce((sum, req) => {
      const staffType = staffTypes.find(t => t.id === req.type)
      return sum + (staffType?.rate || 0) * req.quantity * hours
    }, 0)
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
              <h3 className="font-semibold text-gray-900 mb-4">Staff Summary</h3>
              <div className="space-y-3">
                {bookingDetails.staffRequests.map((request) => {
                  const staffType = staffTypes.find(t => t.id === request.type)
                  const Icon = staffType?.icon || Users
                  return (
                    <div key={request.type} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-gray-900">{request.quantity} {staffType?.name}(s)</span>
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
                {bookingDetails.staffRequests.map((request) => {
                  const staffType = staffTypes.find(t => t.id === request.type)
                  const cost = (staffType?.rate || 0) * request.quantity * hours
                  return (
                    <div key={request.type} className="flex justify-between">
                      <span className="text-gray-600">
                        {request.quantity} {staffType?.name}(s) × {hours.toFixed(1)}h
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
        Your booking has been confirmed and staff have been notified.
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
            <span className="text-gray-700 text-sm">Staff members will confirm within 2 hours</span>
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
          onClick={() => window.location.href = '/booking'}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          View My Bookings
        </button>
        <button
          onClick={() => {
            setStep(1)
            setBookingId(null)
            setAvailableStaff([])
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
        {step === 2 && renderMatchStep()}
        {step === 3 && renderPaymentStep()}
        {step === 4 && renderSuccessStep()}
      </div>
    </div>
  )
}