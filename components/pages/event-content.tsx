"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  Utensils,
  Package,
  Headphones,
  Send,
  DollarSign,
  Users,
  Edit,
  ArrowLeft,
  Loader2,
  UserCheck,
  UserX,
  QrCode,
  Download,
  Share2,
  Plus,
  Filter,
  Search,
  Eye,
  MoreVertical,
  Settings,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Navigation,
  Camera
} from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  role: string
  hourlyRate: number
  status: 'pending' | 'confirmed' | 'declined' | 'completed'
  profileImg: string
  phone: string
  email: string
  rating: number
  experience: string
  checkInStatus: 'not-arrived' | 'checked-in' | 'working' | 'checked-out'
  checkInTime?: string
  checkOutTime?: string
  lastMessage?: string
  messageTime?: string
  canRate?: boolean
  myRating?: number
  expectedArrival?: string
  actualArrival?: string
}

interface EventDetails {
  id: string
  eventTitle: string
  venue: string
  address: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  totalCost: number
  platformFee: number
  subtotal: number
  staffMembers: StaffMember[]
  guestCount?: number
  specialInstructions?: string
  eventType?: string
  duration?: string
  organizerNotes?: string
  timeline?: Array<{
    time: string
    task: string
    assignedTo?: string
    completed?: boolean
  }>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
    case 'declined': return 'bg-red-100 text-red-800 border-red-200'
    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'not-arrived': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'checked-in': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'working': return 'bg-green-100 text-green-800 border-green-200'
    case 'checked-out': return 'bg-purple-100 text-purple-800 border-purple-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStaffIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case 'bartender': return Coffee
    case 'server': return Utensils
    case 'barback': return Package
    case 'event crew': return Headphones
    default: return Users
  }
}

const getCheckInIcon = (status: string) => {
  switch (status) {
    case 'not-arrived': return Clock3
    case 'checked-in': return UserCheck
    case 'working': return CheckCircle2
    case 'checked-out': return UserX
    default: return Clock3
  }
}

export default function EventManagement({ bookingId }: { bookingId: string }) {
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'timeline' | 'messages'>('overview')
  const [messageText, setMessageText] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [filterStaff, setFilterStaff] = useState<string>('all')
  const [searchStaff, setSearchStaff] = useState('')

  useEffect(() => {
    fetchEventDetails()
  }, [bookingId])

  const fetchEventDetails = async () => {
    try {
      setLoading(true)
      console.log('Fetching booking details for ID:', bookingId)
      
      // Get booking details from the existing API
      const response = await fetch(`/api/bookings/${bookingId}`)
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response data:', data)
        
        // Check if we have booking data
        if (data.booking) {
          const booking = data.booking
          console.log('Booking data found:', booking)
          
          // Transform booking data to event structure
          const eventDetails: EventDetails = {
            id: booking.id,
            eventTitle: booking.eventTitle || booking.event?.title || 'Untitled Event',
            venue: booking.venue || booking.event?.venue || 'TBD',
            address: booking.address || booking.event?.address || booking.venue || 'TBD',
            date: booking.date || booking.event?.date || new Date().toISOString().split('T')[0],
            startTime: booking.startTime || booking.event?.startTime || '09:00',
            endTime: booking.endTime || booking.event?.endTime || '17:00',
            status: booking.status || 'pending',
            totalCost: booking.totalCost || 0,
            platformFee: booking.platformFee || 0,
            subtotal: booking.subtotal || 0,
            staffMembers: booking.staffMembers?.map((staff: any) => ({
              ...staff,
              checkInStatus: staff.checkInStatus || 'not-arrived',
              expectedArrival: staff.expectedArrival || booking.startTime,
              actualArrival: staff.actualArrival || null
            })) || [],
            guestCount: booking.guestCount || booking.event?.guestCount,
            specialInstructions: booking.specialInstructions || booking.event?.description,
            eventType: booking.eventType || 'event',
            duration: booking.duration,
            organizerNotes: booking.organizerNotes
          }
          
          console.log('Transformed event details:', eventDetails)
          setEvent(eventDetails)
        } else {
          console.error('No booking data in response:', data)
        }
      } else {
        const errorData = await response.text()
        console.error('Failed to fetch booking details. Status:', response.status, 'Error:', errorData)
      }
    } catch (error) {
      console.error('Error fetching booking details:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCheckInStatus = async (staffId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/staff/${staffId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setEvent(prev => prev ? {
          ...prev,
          staffMembers: prev.staffMembers.map(staff =>
            staff.id === staffId
              ? { 
                  ...staff, 
                  checkInStatus: status as any,
                  checkInTime: status === 'checked-in' ? new Date().toLocaleTimeString() : staff.checkInTime,
                  checkOutTime: status === 'checked-out' ? new Date().toLocaleTimeString() : staff.checkOutTime
                }
              : staff
          )
        } : null)
      }
    } catch (error) {
      console.error('Error updating check-in status:', error)
    }
  }

  const sendMessage = async (staffId: string) => {
    if (!messageText.trim()) return
    
    try {
      const response = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          message: messageText
        })
      })

      if (response.ok) {
        setEvent(prev => prev ? {
          ...prev,
          staffMembers: prev.staffMembers.map(staff =>
            staff.id === staffId
              ? { ...staff, lastMessage: `You: ${messageText}`, messageTime: 'Just now' }
              : staff
          )
        } : null)
        setMessageText('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Event not found</h3>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button onClick={() => window.location.href = '/booking'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  const filteredStaff = event.staffMembers.filter(staff => {
    const matchesFilter = filterStaff === 'all' || staff.checkInStatus === filterStaff
    const matchesSearch = staff.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchStaff.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const staffStats = {
    total: event.staffMembers.length,
    confirmed: event.staffMembers.filter(s => s.status === 'confirmed').length,
    checkedIn: event.staffMembers.filter(s => s.checkInStatus === 'checked-in' || s.checkInStatus === 'working').length,
    working: event.staffMembers.filter(s => s.checkInStatus === 'working').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/booking'}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{event.eventTitle}</h1>
                  <Badge className={`${getStatusColor(event.status)} border`}>
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'staff', label: 'Staff Management', icon: Users },
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'messages', label: 'Messages', icon: MessageSquare }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Venue</label>
                    <p className="text-gray-900">{event.venue}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{event.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date & Time</label>
                    <p className="text-gray-900">
                      {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Guest Count</label>
                    <p className="text-gray-900">{event.guestCount || 'Not specified'}</p>
                  </div>
                </div>
                
                {event.specialInstructions && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                    <p className="text-gray-900 mt-1">{event.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Staff Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Status Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{staffStats.total}</div>
                    <div className="text-sm text-gray-600">Total Staff</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{staffStats.confirmed}</div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{staffStats.checkedIn}</div>
                    <div className="text-sm text-gray-600">Checked In</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{staffStats.working}</div>
                    <div className="text-sm text-gray-600">Currently Working</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-start">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Check-in
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${event.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">${event.platformFee}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-orange-600">${event.totalCost}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            {/* Staff Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search staff..."
                      value={searchStaff}
                      onChange={(e) => setSearchStaff(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-64"
                    />
                  </div>
                  
                  <select
                    value={filterStaff}
                    onChange={(e) => setFilterStaff(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="not-arrived">Not Arrived</option>
                    <option value="checked-in">Checked In</option>
                    <option value="working">Working</option>
                    <option value="checked-out">Checked Out</option>
                  </select>
                </div>
                
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStaff.map(staff => {
                const Icon = getStaffIcon(staff.role)
                const CheckIcon = getCheckInIcon(staff.checkInStatus)
                
                return (
                  <div key={staff.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-200 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={staff.profileImg}
                          alt={staff.name}
                          className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-orange-300"
                          onClick={() => window.location.href = `/staff/${staff.id}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 
                              className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-orange-600"
                              onClick={() => window.location.href = `/staff/${staff.id}`}
                            >
                              {staff.name}
                            </h4>
                            <Badge className={`${getStatusColor(staff.status)} text-xs border`}>
                              {staff.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                            <Icon className="w-3 h-3" />
                            <span>{staff.role}</span>
                            <span>•</span>
                            <span>${staff.hourlyRate}/hr</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{staff.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Check-in Status */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge className={`${getStatusColor(staff.checkInStatus)} text-xs border`}>
                            {staff.checkInStatus.replace('-', ' ')}
                          </Badge>
                        </div>
                        {staff.checkInTime && (
                          <span className="text-xs text-gray-500">
                            In: {staff.checkInTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {staff.checkInStatus === 'not-arrived' && (
                        <Button
                          size="sm"
                          onClick={() => updateCheckInStatus(staff.id, 'checked-in')}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Check In
                        </Button>
                      )}
                      
                      {staff.checkInStatus === 'checked-in' && (
                        <Button
                          size="sm"
                          onClick={() => updateCheckInStatus(staff.id, 'working')}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Start Work
                        </Button>
                      )}
                      
                      {staff.checkInStatus === 'working' && (
                        <Button
                          size="sm"
                          onClick={() => updateCheckInStatus(staff.id, 'checked-out')}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs"
                        >
                          <UserX className="w-3 h-3 mr-1" />
                          Check Out
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStaff(selectedStaff === staff.id ? null : staff.id)}
                        className="px-2 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Message Input */}
                    {selectedStaff === staff.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage(staff.id)}
                          />
                          <Button
                            size="sm"
                            onClick={() => sendMessage(staff.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-2"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Timeline</h3>
            <p className="text-gray-600">Timeline feature coming soon...</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Messages</h3>
            <p className="text-gray-600">Messages feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}