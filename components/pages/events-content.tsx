"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  MapPin, 
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  Clock
} from "lucide-react"

// Mock data for employer's events/jobs
const mockEmployerEvents = [
  {
    id: 1,
    title: "Summer Music Festival 2025",
    eventType: "Music Festival",
    location: "Exhibition Place, Toronto",
    status: "active",
    dateCreated: "2025-08-25",
    eventDate: "2025-10-15",
    eventEndDate: "2025-10-17",
    totalShifts: 8,
    totalPositions: 45,
    filledPositions: 12,
    pendingApplications: 23,
    shiftsCreated: 6,
    avgHourlyRate: 22,
    totalBudget: 15000,
    description: "3-day outdoor music festival with multiple stages and food vendors",
    urgentShifts: 3,
    upcomingDeadlines: 2
  },
  {
    id: 2,
    title: "Corporate Holiday Party",
    eventType: "Corporate Event",
    location: "Fairmont Royal York, Toronto",
    status: "planning",
    dateCreated: "2025-09-01",
    eventDate: "2025-12-15",
    eventEndDate: "2025-12-15",
    totalShifts: 3,
    totalPositions: 15,
    filledPositions: 0,
    pendingApplications: 0,
    shiftsCreated: 0,
    avgHourlyRate: 25,
    totalBudget: 4500,
    description: "Elegant corporate holiday celebration for 200 guests",
    urgentShifts: 0,
    upcomingDeadlines: 0
  },
  {
    id: 3,
    title: "Wedding Season - September",
    eventType: "Wedding Services",
    location: "Multiple Venues, GTA",
    status: "urgent",
    dateCreated: "2025-08-20",
    eventDate: "2025-09-07",
    eventEndDate: "2025-09-30",
    totalShifts: 12,
    totalPositions: 30,
    filledPositions: 18,
    pendingApplications: 15,
    shiftsCreated: 12,
    avgHourlyRate: 20,
    totalBudget: 8000,
    description: "Multiple wedding events throughout September",
    urgentShifts: 5,
    upcomingDeadlines: 3
  },
  {
    id: 4,
    title: "Food & Wine Festival",
    eventType: "Food Festival",
    location: "Harbourfront Centre, Toronto",
    status: "completed",
    dateCreated: "2025-07-15",
    eventDate: "2025-08-20",
    eventEndDate: "2025-08-22",
    totalShifts: 6,
    totalPositions: 25,
    filledPositions: 25,
    pendingApplications: 0,
    shiftsCreated: 6,
    avgHourlyRate: 18,
    totalBudget: 6000,
    description: "3-day culinary celebration with local restaurants",
    urgentShifts: 0,
    upcomingDeadlines: 0
  },
  {
    id: 5,
    title: "New Year's Eve Gala",
    eventType: "Gala",
    location: "CN Tower, Toronto",
    status: "draft",
    dateCreated: "2025-09-02",
    eventDate: "2025-12-31",
    eventEndDate: "2025-12-31",
    totalShifts: 4,
    totalPositions: 20,
    filledPositions: 0,
    pendingApplications: 0,
    shiftsCreated: 1,
    avgHourlyRate: 30,
    totalBudget: 8000,
    description: "Premium New Year's Eve celebration with city views",
    urgentShifts: 0,
    upcomingDeadlines: 0
  }
]

export function EventsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEvents = mockEmployerEvents.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-50 text-red-700 border border-red-200"
      case "active":
        return "bg-green-50 text-green-700 border border-green-200"
      case "planning":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      case "completed":
        return "bg-gray-50 text-gray-700 border border-gray-200"
      case "draft":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertCircle className="w-4 h-4" />
      case "active":
        return <TrendingUp className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getHiringProgress = (filled: number, total: number) => {
    return total > 0 ? Math.round((filled / total) * 100) : 0
  }

  // Summary stats - only most critical KPIs
  const urgentEvents = mockEmployerEvents.filter(e => e.status === "urgent").length
  const totalPositions = mockEmployerEvents.reduce((sum, e) => sum + e.totalPositions, 0)
  const filledPositions = mockEmployerEvents.reduce((sum, e) => sum + e.filledPositions, 0)
  const totalPendingApplications = mockEmployerEvents.reduce((sum, e) => sum + e.pendingApplications, 0)

  const handleEventClick = (eventId: number) => {
    window.location.href = `/events/${eventId}/shifts`
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Critical KPIs Only */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-xl lg:text-2xl font-bold text-red-600">{urgentEvents}</p>
              </div>
              <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Staff Hired</p>
                <p className="text-xl lg:text-2xl font-bold text-orange-600">{filledPositions}/{totalPositions}</p>
              </div>
              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Applications</p>
                <p className="text-xl lg:text-2xl font-bold text-blue-600">{totalPendingApplications}</p>
              </div>
              <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Progress</p>
                <p className="text-xl lg:text-2xl font-bold text-green-600">{getHiringProgress(filledPositions, totalPositions)}%</p>
              </div>
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              onClick={() => window.location.href = '/events/create'}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs - Mobile Scrollable */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border overflow-x-auto">
            {[
              { key: "all", label: "All", count: mockEmployerEvents.length },
              { key: "active", label: "Active", count: mockEmployerEvents.filter(e => e.status === 'active').length },
              { key: "urgent", label: "Urgent", count: mockEmployerEvents.filter(e => e.status === 'urgent').length },
              { key: "planning", label: "Planning", count: mockEmployerEvents.filter(e => e.status === 'planning').length },
              { key: "completed", label: "Done", count: mockEmployerEvents.filter(e => e.status === 'completed').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  statusFilter === tab.key 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <Badge variant="secondary" className={`text-xs ${
                  statusFilter === tab.key ? "bg-orange-400 text-white" : "bg-gray-200"
                }`}>
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>
          
          <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
            {filteredEvents.length} events
          </p>
        </div>
      </div>

      {/* Events List - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-4">
        {filteredEvents.map((event) => (
          <Card 
            key={event.id} 
            className="hover:shadow-lg transition-all duration-200 border border-gray-200 cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
            <CardContent className="p-4 lg:p-6">
              {/* Mobile Layout */}
              <div className="lg:hidden space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getStatusColor(event.status)} text-xs font-medium flex items-center gap-1`}>
                        {getStatusIcon(event.status)}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                      {event.urgentShifts > 0 && (
                        <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs font-medium">
                          {event.urgentShifts} urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{event.eventType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-600">{event.filledPositions}/{event.totalPositions}</div>
                    <div className="text-xs text-gray-500">Staff</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{event.pendingApplications}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{event.shiftsCreated}/{event.totalShifts}</div>
                    <div className="text-xs text-gray-500">Shifts</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Hiring Progress</span>
                    <span>{getHiringProgress(event.filledPositions, event.totalPositions)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        event.status === "urgent" ? 'bg-red-500' :
                        event.filledPositions === event.totalPositions ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.max(getHiringProgress(event.filledPositions, event.totalPositions), 5)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <div className="flex justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {event.title}
                          </h2>
                          <Badge className={`${getStatusColor(event.status)} text-xs font-medium flex items-center gap-1`}>
                            {getStatusIcon(event.status)}
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                          {event.urgentShifts > 0 && (
                            <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs font-medium">
                              {event.urgentShifts} Urgent Shifts
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{event.eventType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.eventDate)} {event.eventEndDate !== event.eventDate && `- ${formatDate(event.eventEndDate)}`}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{event.shiftsCreated}/{event.totalShifts}</div>
                        <div className="text-xs text-gray-500">Shifts Created</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{event.filledPositions}/{event.totalPositions}</div>
                        <div className="text-xs text-gray-500">Staff Hired</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{event.pendingApplications}</div>
                        <div className="text-xs text-gray-500">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">${event.avgHourlyRate}</div>
                        <div className="text-xs text-gray-500">Avg Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{getHiringProgress(event.filledPositions, event.totalPositions)}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Hiring Progress</span>
                        <span>{getHiringProgress(event.filledPositions, event.totalPositions)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            event.status === "urgent" ? 'bg-red-500' :
                            event.filledPositions === event.totalPositions ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.max(getHiringProgress(event.filledPositions, event.totalPositions), 5)}%` }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Created {formatDate(event.dateCreated)}</span>
                      {event.upcomingDeadlines > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.upcomingDeadlines} upcoming deadlines</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 lg:p-12 text-center">
            <Building2 className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4 text-sm lg:text-base">
              Try adjusting your search terms or create your first event
            </p>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => window.location.href = '/events/create'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}