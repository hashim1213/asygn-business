"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  Coffee,
  Utensils,
  Package,
  Headphones,
  Send,
  DollarSign,
  Users,
  Edit,
  Loader2,
  Search,
  Eye,
  Save,
  Plus,
  ArrowRight,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  Briefcase,
  Grid3X3,
  List,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronRight
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
  lastMessage?: string
  messageTime?: string
  canRate?: boolean
  myRating?: number
}

interface Booking {
  id: string
  eventTitle: string
  venue: string
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
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
    case 'declined': return 'bg-red-100 text-red-800 border-red-200'
    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
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

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingBooking, setEditingBooking] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Booking>>({})
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings/my-bookings')
      
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      } else {
        console.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesSearch = booking.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.venue.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const sendQuickMessage = async (staffId: string, bookingId: string) => {
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
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? {
                ...booking,
                staffMembers: booking.staffMembers.map(staff =>
                  staff.id === staffId
                    ? { ...staff, lastMessage: `You: ${messageText}`, messageTime: 'Just now' }
                    : staff
                )
              }
            : booking
        ))
        setMessageText('')
        setSelectedStaff(null)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const saveBookingEdit = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, ...editForm } : booking
        ))
        setEditingBooking(null)
        setEditForm({})
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const toggleRowExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId)
    } else {
      newExpanded.add(bookingId)
    }
    setExpandedRows(newExpanded)
  }

  const getBookingStats = () => {
    const total = bookings.length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const inProgress = bookings.filter(b => b.status === 'in-progress').length
    const completed = bookings.filter(b => b.status === 'completed').length
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalCost, 0)

    return { total, confirmed, inProgress, completed, totalRevenue }
  }

  const stats = getBookingStats()

  const renderListView = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-700">
            <div className="col-span-1"></div>
            <div className="col-span-3">Event</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-2">Venue</div>
            <div className="col-span-1">Staff</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Cost</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => {
            const isExpanded = expandedRows.has(booking.id)
            const confirmedStaff = booking.staffMembers.filter(s => s.status === 'confirmed').length
            const totalStaff = booking.staffMembers.length

            return (
              <div key={booking.id}>
                {/* Main Row */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Expand Button */}
                  <div className="col-span-1 flex items-center">
                    <button
                      onClick={() => toggleRowExpansion(booking.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* Event */}
                  <div className="col-span-3">
                    <div className="font-medium text-gray-900 truncate">{booking.eventTitle}</div>
                    <div className="text-sm text-gray-500 truncate">{booking.eventType}</div>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="col-span-2">
                    <div className="text-sm text-gray-900 truncate">{booking.venue}</div>
                    {booking.guestCount && (
                      <div className="text-sm text-gray-500">{booking.guestCount} guests</div>
                    )}
                  </div>

                  {/* Staff */}
                  <div className="col-span-1">
                    <div className="text-sm font-medium text-gray-900">
                      {confirmedStaff}/{totalStaff}
                    </div>
                    <div className="text-sm text-gray-500">confirmed</div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <Badge className={`${getStatusColor(booking.status)} text-xs border`}>
                      {booking.status}
                    </Badge>
                  </div>

                  {/* Cost */}
                  <div className="col-span-1">
                    <div className="text-sm font-medium text-gray-900">
                      ${booking.totalCost}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/booking/${booking.id}`}
                        className="p-1 h-6 w-6"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBooking(booking.id)
                          setEditForm(booking)
                        }}
                        className="p-1 h-6 w-6"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Row Content */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Event Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Event Details</h4>
                        <div className="space-y-2 text-sm">
                          {booking.specialInstructions && (
                            <div>
                              <span className="text-gray-500">Instructions:</span>
                              <p className="text-gray-900 mt-1">{booking.specialInstructions}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-gray-500">Subtotal:</span>
                              <span className="text-gray-900 ml-2">${booking.subtotal}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Platform Fee:</span>
                              <span className="text-gray-900 ml-2">${booking.platformFee}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Staff Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Staff Team</h4>
                        <div className="space-y-3">
                          {booking.staffMembers.map((staff) => {
                            const Icon = getStaffIcon(staff.role)
                            return (
                              <div key={staff.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{staff.name}</div>
                                    <div className="text-gray-500 text-xs">{staff.role} • ${staff.hourlyRate}/hr</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getStatusColor(staff.status)} text-xs border`}>
                                    {staff.status}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-6 w-6"
                                      onClick={() => window.open(`tel:${staff.phone}`)}
                                    >
                                      <Phone className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-6 w-6"
                                      onClick={() => window.open(`mailto:${staff.email}`)}
                                    >
                                      <Mail className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-6 w-6"
                                      onClick={() => setSelectedStaff(selectedStaff === staff.id ? null : staff.id)}
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Quick Message Interface */}
                    {selectedStaff && booking.staffMembers.some(s => s.id === selectedStaff) && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Quick message to staff..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onKeyPress={(e) => e.key === 'Enter' && sendQuickMessage(selectedStaff, booking.id)}
                          />
                          <Button
                            size="sm"
                            onClick={() => sendQuickMessage(selectedStaff, booking.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first event booking.'
              }
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderBookingCard = (booking: Booking) => {
    const isEditing = editingBooking === booking.id
    const confirmedStaff = booking.staffMembers.filter(s => s.status === 'confirmed').length
    const totalStaff = booking.staffMembers.length

    if (isEditing) {
      return (
        <div key={booking.id} className="bg-white rounded-lg border border-orange-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={editForm.eventTitle || booking.eventTitle}
                onChange={(e) => setEditForm(prev => ({ ...prev, eventTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                value={editForm.venue || booking.venue}
                onChange={(e) => setEditForm(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={editForm.date || booking.date}
                onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={editForm.startTime || booking.startTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={editForm.endTime || booking.endTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
            <textarea
              value={editForm.specialInstructions || booking.specialInstructions || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Any special instructions for the event..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => saveBookingEdit(booking.id)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingBooking(null)
                setEditForm({})
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div key={booking.id} className="bg-white rounded-lg border border-gray-200 hover:border-orange-200 transition-all hover:shadow-md group">
        {/* Main Card Content - Clickable to navigate to event page */}
        <div 
          className="p-6 cursor-pointer"
          onClick={() => window.location.href = `/booking/${booking.id}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                  {booking.eventTitle}
                </h3>
                <Badge className={`${getStatusColor(booking.status)} text-xs border`}>
                  {booking.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="truncate">{booking.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">${booking.totalCost}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-gray-600">
                    {confirmedStaff}/{totalStaff} staff confirmed
                  </span>
                </div>
                {booking.guestCount && (
                  <div className="text-sm text-gray-600">
                    {booking.guestCount} guests expected
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowQuickActions(showQuickActions === booking.id ? null : booking.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              <ArrowRight className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Quick Staff Preview */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 text-sm">Staff Team</h4>
              <span className="text-xs text-gray-500">Click event to manage</span>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {booking.staffMembers.slice(0, 5).map((staff, index) => {
                const Icon = getStaffIcon(staff.role)
                return (
                  <div
                    key={staff.id}
                    className="inline-block w-8 h-8 rounded-full ring-2 ring-white bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.href = `/staff/${staff.id}`
                    }}
                    title={`${staff.name} - ${staff.role}`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                )
              })}
              {booking.staffMembers.length > 5 && (
                <div className="inline-block w-8 h-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{booking.staffMembers.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Menu */}
        {showQuickActions === booking.id && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingBooking(booking.id)
                  setEditForm(booking)
                  setShowQuickActions(null)
                }}
                className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Quick Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `/booking/${booking.id}`
                }}
                className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Manage Event
              </Button>
            </div>
          </div>
        )}

        {/* Quick Message Interface */}
        {selectedStaff && booking.staffMembers.some(s => s.id === selectedStaff) && (
          <div className="border-t border-gray-200 p-4 bg-orange-50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Quick message to staff..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && sendQuickMessage(selectedStaff, booking.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  sendQuickMessage(selectedStaff, booking.id)
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage your events and staff assignments</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'cards' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Card View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <Button 
                onClick={() => window.location.href = '/workers'}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {viewMode === 'list' ? (
          renderListView()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map(booking => renderBookingCard(booking))}
          </div>
        )}

        {viewMode === 'cards' && filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first event booking.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button 
                onClick={() => window.location.href = '/book-staff'}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Booking
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}