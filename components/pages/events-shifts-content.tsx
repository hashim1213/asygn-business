"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  List, 
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { ShiftsAnalytics } from "@/components/shifts/ShiftsAnalytics"
import { CreateShiftModal } from "@/components/shifts/CreateShiftModal"
import { ShiftsListView } from "@/components/shifts/ShiftsListView"
import { ShiftsCalendarView } from "@/components/shifts/ShiftsCalendarView"
import { ShiftDetailsSheet } from "@/components/shifts/ShiftDetailsModal"

// Mock event data - in real app, fetch by eventId
const mockEvent = {
  id: 1,
  title: "Summer Music Festival 2025",
  eventType: "Music Festival",
  location: "Exhibition Place, Toronto",
  eventDate: "2025-10-15",
  eventEndDate: "2025-10-17",
  status: "active",
  totalPositions: 45,
  filledPositions: 12,
  totalBudget: 15000,
  description: "3-day outdoor music festival with multiple stages and food vendors"
}

// Mock shifts for this specific event
const mockEventShifts = [
  {
    id: 1,
    eventId: 1,
    title: "Main Stage Bar Service",
    location: "Main Stage Area",
    date: "2025-10-15",
    startTime: "14:00",
    endTime: "23:00",
    hourlyRate: 22,
    staffNeeded: 6,
    staffAssigned: [1, 2],
    status: "open",
    requirements: ["Bartender", "Smart Serve", "Event Experience"],
    description: "High-volume bar service during main stage performances",
    shiftType: "Bar Service"
  },
  {
    id: 2,
    eventId: 1,
    title: "Food Vendor Support",
    location: "Food Court Area",
    date: "2025-10-15",
    startTime: "11:00",
    endTime: "22:00",
    hourlyRate: 18,
    staffNeeded: 8,
    staffAssigned: [3, 4, 5],
    status: "urgent",
    requirements: ["Server", "Customer Service", "Physical Stamina"],
    description: "Support food vendors during festival hours",
    shiftType: "Food Service"
  },
  {
    id: 3,
    eventId: 1,
    title: "VIP Hospitality",
    location: "VIP Tent",
    date: "2025-10-16",
    startTime: "16:00",
    endTime: "01:00",
    hourlyRate: 25,
    staffNeeded: 4,
    staffAssigned: [6, 7, 8, 9],
    status: "filled",
    requirements: ["Server", "Professional Appearance", "VIP Experience"],
    description: "Exclusive service for VIP guests",
    shiftType: "VIP Service"
  },
  {
    id: 4,
    eventId: 1,
    title: "Security - Main Entrance",
    location: "Main Gate",
    date: "2025-10-15",
    startTime: "12:00",
    endTime: "02:00",
    hourlyRate: 20,
    staffNeeded: 3,
    staffAssigned: [],
    status: "urgent",
    requirements: ["Security License", "Crowd Control", "Physical Fitness"],
    description: "Entrance security and crowd management",
    shiftType: "Security"
  },
  {
    id: 5,
    eventId: 1,
    title: "Stage Crew Setup",
    location: "All Stages",
    date: "2025-10-14",
    startTime: "06:00",
    endTime: "14:00",
    hourlyRate: 24,
    staffNeeded: 10,
    staffAssigned: [10, 11],
    status: "urgent",
    requirements: ["Stage Experience", "Physical Labor", "Early Morning"],
    description: "Pre-event stage and equipment setup",
    shiftType: "Stage Crew"
  },
  {
    id: 6,
    eventId: 1,
    title: "Cleanup Crew",
    location: "Entire Venue",
    date: "2025-10-17",
    startTime: "23:00",
    endTime: "08:00",
    hourlyRate: 19,
    staffNeeded: 12,
    staffAssigned: [],
    status: "open",
    requirements: ["Physical Stamina", "Night Shift", "Teamwork"],
    description: "Post-event venue cleanup and breakdown",
    shiftType: "Cleanup"
  }
]

interface EventShiftsContentProps {
  eventId: string
}

export function EventShiftsContent({ eventId }: EventShiftsContentProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [hireShift, setHireShift] = useState<any>(null)
  const [event, setEvent] = useState(mockEvent)
  const [shifts, setShifts] = useState(mockEventShifts)

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch = shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         shift.shiftType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || shift.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleHireStaff = (shift: any) => {
    setHireShift(shift)
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = (open: boolean) => {
    if (!open) {
      setHireShift(null)
    }
    setShowCreateModal(open)
  }

  // Calculate event-level metrics
  const totalShiftPositions = shifts.reduce((sum, shift) => sum + shift.staffNeeded, 0)
  const filledShiftPositions = shifts.reduce((sum, shift) => sum + shift.staffAssigned.length, 0)
  const urgentShifts = shifts.filter(s => s.status === 'urgent').length
  const openShifts = shifts.filter(s => s.status === 'open').length
  const filledShifts = shifts.filter(s => s.status === 'filled').length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getProgressPercentage = (filled: number, total: number) => {
    return total > 0 ? Math.round((filled / total) * 100) : 0
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Back Navigation & Event Header */}
      <div className="space-y-4">
        <Link href="/events" className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                  <Badge className="bg-green-50 text-green-700 border border-green-200">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{event.eventType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(event.eventDate)}
                      {event.eventEndDate !== event.eventDate && ` - ${formatDate(event.eventEndDate)}`}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700">{event.description}</p>
              </div>
              
              <div className="ml-6">
                <Button variant="outline" size="sm">
                  Edit Event Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event-Level Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positions Filled</p>
                <p className="text-2xl font-bold text-green-600">{filledShiftPositions}/{totalShiftPositions}</p>
                <p className="text-xs text-gray-500">{getProgressPercentage(filledShiftPositions, totalShiftPositions)}% complete</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Shifts</p>
                <p className="text-2xl font-bold text-red-600">{urgentShifts}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Hourly Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${Math.round(shifts.reduce((sum, s) => sum + s.hourlyRate, 0) / shifts.length)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shifts Management Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Shifts</h2>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search shifts by title, location, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            className="flex items-center gap-2"
          >
            {viewMode === "list" ? <Calendar className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {viewMode === "list" ? "Calendar" : "List"} View
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter by Role
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Shift Status Tabs */}
      {viewMode === "list" && (
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border">
            {[
              { key: "all", label: "All Shifts", count: shifts.length },
              { key: "urgent", label: "Urgent", count: urgentShifts },
              { key: "open", label: "Open", count: openShifts },
              { key: "filled", label: "Fully Staffed", count: filledShifts },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <Badge variant="secondary" className={`text-xs ${
                  activeTab === tab.key ? "bg-orange-400 text-white" : "bg-gray-200"
                }`}>
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-500">
            {filteredShifts.length} of {shifts.length} shifts
          </p>
        </div>
      )}

      {/* Shift Types Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Array.from(new Set(shifts.map(s => s.shiftType))).map((type) => {
              const typeShifts = shifts.filter(s => s.shiftType === type)
              const typeFilled = typeShifts.reduce((sum, s) => sum + s.staffAssigned.length, 0)
              const typeTotal = typeShifts.reduce((sum, s) => sum + s.staffNeeded, 0)
              
              return (
                <div key={type} className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm font-medium text-gray-900">{type}</div>
                  <div className="text-lg font-bold text-orange-600">{typeFilled}/{typeTotal}</div>
                  <div className="text-xs text-gray-500">{typeShifts.length} shifts</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      {viewMode === "calendar" ? (
        <ShiftsCalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          filteredShifts={filteredShifts}
          onShiftClick={setSelectedShift}
        />
      ) : (
        <ShiftsListView
          filteredShifts={filteredShifts}
          onViewDetails={setSelectedShift}
          onHireStaff={handleHireStaff}
        />
      )}

      {/* Empty State */}
      {filteredShifts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {shifts.length === 0 ? "No shifts created yet" : "No shifts found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {shifts.length === 0 
                ? "Start by creating your first shift for this event" 
                : "Try adjusting your search terms or filters"
              }
            </p>
            {shifts.length === 0 && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Shift
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreateShiftModal
        open={showCreateModal}
        onOpenChange={handleCloseCreateModal}
        eventContext={{
          eventId: parseInt(eventId),
          eventTitle: event.title,
          eventLocation: event.location,
          eventDate: event.eventDate
        }}
        initialShift={hireShift ? {
          title: hireShift.title,
          location: hireShift.location,
          date: hireShift.date,
          startTime: hireShift.startTime,
          endTime: hireShift.endTime,
          hourlyRate: hireShift.hourlyRate.toString(),
          staffNeeded: hireShift.staffNeeded.toString(),
          staffType: hireShift.requirements.find(req => 
            ['Server', 'Bartender', 'Host/Hostess', 'Cook', 'Kitchen Assistant', 'Dishwasher', 'Barista', 'Cashier'].includes(req)
          ) || 'Server',
          description: hireShift.description || '',
          specialRequirements: hireShift.requirements.filter(req => 
            !['Server', 'Bartender', 'Host/Hostess', 'Cook', 'Kitchen Assistant', 'Dishwasher', 'Barista', 'Cashier'].includes(req)
          ),
          dressAttire: hireShift.requirements.find(req => 
            ['Business Casual', 'Uniform Provided', 'All Black', 'Chef Whites'].includes(req)
          ) || 'Business Casual',
          workerType: 'regular' as const,
          useCurrentLocation: false
        } : undefined}
        startFromStaff={!!hireShift}
      />

      <ShiftDetailsSheet
        shift={selectedShift}
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
      />
    </div>
  )
}