"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users,
  Clock,
  MapPin,
  Calendar,
  Coffee,
  Utensils,
  Package,
  Headphones,
  Phone,
  MessageSquare,
  Search,
  Filter,
  TrendingUp,
  Building2,
  AlertCircle,
  CheckCircle2,
  Timer,
  Activity,
  Eye,
  RefreshCw,
  Loader2,
  Map,
  List,
  Grid3X3
} from 'lucide-react'

interface StaffOnShift {
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

const getStaffIcon = (staffType: string) => {
  switch (staffType.toUpperCase()) {
    case 'BARTENDER': return Coffee
    case 'SERVER': return Utensils
    case 'BARBACK': return Package
    case 'EVENT_CREW': return Headphones
    default: return Users
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'checked-in': return 'bg-green-100 text-green-800 border-green-200'
    case 'on-break': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'checked-out': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'no-show': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'checked-in': return CheckCircle2
    case 'on-break': return Timer
    case 'checked-out': return Clock
    case 'no-show': return AlertCircle
    default: return Activity
  }
}

export default function StaffContent() {
  const [staffOnShift, setStaffOnShift] = useState<StaffOnShift[]>([])
  const [stats, setStats] = useState<ShiftStats>({
    totalActive: 0,
    onBreak: 0,
    checkedOut: 0,
    totalHours: 0,
    averageRating: 0,
    activeVenues: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchStaffOnShift()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshStaffData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchStaffOnShift = async () => {
    try {
      setLoading(true)
      
      // Get current date for today's shifts
      const today = new Date().toISOString().split('T')[0]
      
      const response = await fetch(`/api/staff/on-shift?date=${today}`)
      
      if (response.ok) {
        const data = await response.json()
        setStaffOnShift(data.staff)
        setStats(data.stats)
        setLastUpdated(new Date())
      } else {
        console.error('Failed to fetch staff on shift')
        // Fallback to mock data for development
        loadMockData()
      }
    } catch (error) {
      console.error('Error fetching staff on shift:', error)
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const refreshStaffData = async () => {
    setRefreshing(true)
    await fetchStaffOnShift()
    setRefreshing(false)
  }

  const loadMockData = () => {
    // Mock data for development - replace with real API data
    const mockStaff: StaffOnShift[] = [
      {
        id: 'staff_1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(555) 123-4567',
        image: '',
        staffType: 'SERVER',
        hourlyRate: 25,
        rating: 4.8,
        assignmentId: 'assign_1',
        bookingId: 'booking_1',
        eventTitle: 'Corporate Holiday Party',
        venue: 'Downtown Convention Center',
        address: '123 Main St, Brandon, MB',
        eventDate: new Date().toISOString().split('T')[0],
        startTime: '17:00',
        endTime: '23:00',
        status: 'checked-in',
        checkInTime: '16:45',
        hoursWorked: 3.5,
        expectedHours: 6,
        lastActivity: '5 minutes ago'
      },
      {
        id: 'staff_2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '(555) 234-5678',
        image: '',
        staffType: 'BARTENDER',
        hourlyRate: 35,
        rating: 4.6,
        assignmentId: 'assign_2',
        bookingId: 'booking_2',
        eventTitle: 'Wedding Reception',
        venue: 'Grand Ballroom',
        address: '456 Oak Ave, Brandon, MB',
        eventDate: new Date().toISOString().split('T')[0],
        startTime: '18:00',
        endTime: '24:00',
        status: 'on-break',
        checkInTime: '17:30',
        breakStartTime: '20:15',
        hoursWorked: 2.75,
        expectedHours: 6,
        lastActivity: '2 minutes ago'
      },
      {
        id: 'staff_3',
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '(555) 345-6789',
        image: '',
        staffType: 'EVENT_CREW',
        hourlyRate: 22,
        rating: 4.9,
        assignmentId: 'assign_3',
        bookingId: 'booking_1',
        eventTitle: 'Corporate Holiday Party',
        venue: 'Downtown Convention Center',
        address: '123 Main St, Brandon, MB',
        eventDate: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '23:00',
        status: 'checked-in',
        checkInTime: '15:45',
        hoursWorked: 4.25,
        expectedHours: 7,
        lastActivity: '1 minute ago'
      }
    ]

    setStaffOnShift(mockStaff)
    setStats({
      totalActive: mockStaff.filter(s => s.status === 'checked-in').length,
      onBreak: mockStaff.filter(s => s.status === 'on-break').length,
      checkedOut: mockStaff.filter(s => s.status === 'checked-out').length,
      totalHours: mockStaff.reduce((sum, s) => sum + s.hoursWorked, 0),
      averageRating: mockStaff.reduce((sum, s) => sum + s.rating, 0) / mockStaff.length,
      activeVenues: new Set(mockStaff.map(s => s.venue)).size
    })
  }

  const filteredStaff = staffOnShift.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sendMessage = async (staffId: string, bookingId: string) => {
    // Navigate to messages or open quick message modal
    window.location.href = `/messages?booking=${bookingId}&staff=${staffId}`
  }

  const viewBookingDetails = (bookingId: string) => {
    window.location.href = `/booking/${bookingId}`
  }

  const renderStaffCard = (staff: StaffOnShift) => {
    const Icon = getStaffIcon(staff.staffType)
    const StatusIcon = getStatusIcon(staff.status)
    const progressPercentage = (staff.hoursWorked / staff.expectedHours) * 100

    return (
      <div key={staff.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <div className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    staff.status === 'checked-in' ? 'bg-green-500' :
                    staff.status === 'on-break' ? 'bg-yellow-500' :
                    staff.status === 'checked-out' ? 'bg-blue-500' : 'bg-red-500'
                  }`}>
                    <StatusIcon className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{staff.staffType.toLowerCase().replace('_', ' ')}</span>
                  <span>•</span>
                  <span>${staff.hourlyRate}/hr</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span>{staff.rating}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Badge className={`${getStatusColor(staff.status)} text-xs border`}>
              {staff.status.replace('-', ' ')}
            </Badge>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{staff.eventTitle}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{staff.venue}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{staff.startTime} - {staff.endTime}</span>
              {staff.checkInTime && (
                <span className="text-green-600 font-medium">
                  (Checked in: {staff.checkInTime})
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {staff.hoursWorked.toFixed(1)}h / {staff.expectedHours}h
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Last activity: {staff.lastActivity}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`tel:${staff.phone}`)}
                className="p-2 hover:bg-green-50"
              >
                <Phone className="w-4 h-4 text-green-600" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => sendMessage(staff.id, staff.bookingId)}
                className="p-2 hover:bg-blue-50"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => viewBookingDetails(staff.bookingId)}
                className="p-2 hover:bg-orange-50"
              >
                <Eye className="w-4 h-4 text-orange-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStaffList = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-3">Staff Member</div>
          <div className="col-span-2">Event</div>
          <div className="col-span-2">Venue</div>
          <div className="col-span-2">Hours</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredStaff.map((staff) => {
            const Icon = getStaffIcon(staff.staffType)
            const progressPercentage = (staff.hoursWorked / staff.expectedHours) * 100
            
            return (
              <div key={staff.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      staff.status === 'checked-in' ? 'bg-green-500' :
                      staff.status === 'on-break' ? 'bg-yellow-500' :
                      staff.status === 'checked-out' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{staff.name}</div>
                    <div className="text-xs text-gray-500">{staff.staffType.toLowerCase().replace('_', ' ')}</div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900 truncate">{staff.eventTitle}</div>
                  <div className="text-xs text-gray-500">{staff.startTime} - {staff.endTime}</div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm text-gray-900 truncate">{staff.venue}</div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900">
                    {staff.hoursWorked.toFixed(1)}h / {staff.expectedHours}h
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-orange-500 h-1 rounded-full"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Badge className={`${getStatusColor(staff.status)} text-xs`}>
                    {staff.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="col-span-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`tel:${staff.phone}`)}
                    className="p-1 h-6 w-6"
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => sendMessage(staff.id, staff.bookingId)}
                    className="p-1 h-6 w-6"
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewBookingDetails(staff.bookingId)}
                    className="p-1 h-6 w-6"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading staff on shift...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900">Staff on Shift</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-500">Live</span>
                </div>
              </div>
              <p className="text-gray-600">Real-time tracking of your active staff members</p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStaffData}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalActive}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.onBreak}</div>
              <div className="text-sm text-gray-600">On Break</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.checkedOut}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalHours.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.activeVenues}</div>
              <div className="text-sm text-gray-600">Venues</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search staff, events, or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="checked-in">Checked In</option>
                <option value="on-break">On Break</option>
                <option value="checked-out">Checked Out</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff on shift</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'No staff match your current filters'
                : 'No staff are currently working on active bookings'
              }
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map(staff => renderStaffCard(staff))}
              </div>
            ) : (
              renderStaffList()
            )}
          </>
        )}
      </div>
    </div>
  )
}