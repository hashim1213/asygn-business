"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Clock, 
  TrendingUp, 
  MessageCircle, 
  MapPin, 
  Phone, 
  AlertTriangle,
  Calendar,
  DollarSign,
  ChevronRight,
  Map,
  List,
  Zap,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Filter,
  Bell,
  Activity
} from "lucide-react"

// Mock data with more realistic scenarios
const mockStats = {
  activeStaff: 12,
  totalStaff: 24,
  openShifts: 5,
  fillRate: 87,
  avgResponse: 8,
  todayStaffingCost: 2840,
  weeklyStaffingCost: 18200,
  monthlyBudget: 75000,
  avgHourlyRate: 23
}

const mockUrgentShifts = [
  {
    id: 1,
    title: "Server",
    location: "The Golden Fork",
    address: "123 Main St",
    time: "11:00 AM - 7:00 PM",
    timeUntil: "2 hours",
    payRate: 22,
    staffNeeded: 2,
    urgency: "critical",
    totalPay: 176
  },
  {
    id: 2,
    title: "Bartender", 
    location: "Rooftop Lounge",
    address: "456 King Ave",
    time: "5:00 PM - 1:00 AM",
    timeUntil: "6 hours",
    payRate: 28,
    staffNeeded: 1,
    urgency: "high",
    totalPay: 224
  },
  {
    id: 3,
    title: "Kitchen Prep",
    location: "Bistro Central",
    address: "789 Oak St",
    time: "3:00 PM - 11:00 PM", 
    timeUntil: "4 hours",
    payRate: 19,
    staffNeeded: 1,
    urgency: "medium",
    totalPay: 152
  }
]

const mockActiveStaff = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Server",
    location: "The Golden Fork",
    status: "active",
    avatar: "/woman-server.png",
    checkIn: "10:30 AM",
    hoursWorked: 2.5,
    currentCost: 57.50,
    hourlyRate: 23
  },
  {
    id: 2,
    name: "Mike Chen", 
    role: "Bartender",
    location: "Downtown Pub",
    status: "break",
    avatar: "/man-bartender.png",
    checkIn: "6:00 PM",
    hoursWorked: 4,
    breakEnds: "8:15 PM",
    currentCost: 112,
    hourlyRate: 28
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Kitchen Staff", 
    location: "Uptown Bistro",
    status: "active",
    avatar: "/woman-chef.png",
    checkIn: "2:00 PM",
    hoursWorked: 1.5,
    currentCost: 28.50,
    hourlyRate: 19
  },
  {
    id: 4,
    name: "Carlos Rodriguez",
    role: "Chef",
    location: "Fine Dining Co",
    status: "arriving",
    avatar: "/man-chef.png",
    checkIn: "7:30 AM",
    eta: "3 min",
    shift: "Morning Prep",
    hourlyRate: 32
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Host",
    location: "Rooftop Lounge", 
    status: "active",
    avatar: "/woman-host.png",
    checkIn: "5:00 PM",
    hoursWorked: 0.5,
    currentCost: 10,
    hourlyRate: 20
  }
]

const mockRecentActivity = [
  { message: "Carlos Rodriguez arriving at Fine Dining Co", time: "30s ago", type: "arriving", priority: "high" },
  { message: "2 new worker applications for Server position", time: "2m ago", type: "application", priority: "medium" },
  { message: "Mike Chen started break (15 min)", time: "3m ago", type: "break", priority: "low" },
  { message: "Urgent: Bartender shift needs coverage", time: "5m ago", type: "urgent", priority: "critical" },
  { message: "Sarah Johnson completed assigned section", time: "8m ago", type: "complete", priority: "low" },
  { message: "Emma Davis checked in early (+10 min)", time: "12m ago", type: "checkin", priority: "medium" },
  { message: "Shift cost alert: Over budget by $150 today", time: "15m ago", type: "cost", priority: "high" }
]

export function DashboardContent() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [showAllActivity, setShowAllActivity] = useState(false)

  const handleFillShift = (shiftId: number) => {
    console.log("Navigate to fill shift:", shiftId)
  }

  const handleQuickMessage = (staffId: number) => {
    console.log("Quick message to:", staffId)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active": return { color: "bg-green-500", text: "Active", textColor: "text-green-700" }
      case "break": return { color: "bg-yellow-500", text: "On Break", textColor: "text-yellow-700" }
      case "arriving": return { color: "bg-blue-500", text: "Arriving", textColor: "text-blue-700" }
      default: return { color: "bg-gray-400", text: "Offline", textColor: "text-gray-700" }
    }
  }

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-50 border border-red-200"
      case "high": return "bg-orange-50 border border-orange-200"
      case "medium": return "bg-yellow-50 border border-yellow-200"
      default: return "bg-gray-50 border border-gray-200"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "arriving": return <MapPin className="h-4 w-4 text-blue-500" />
      case "application": return <Users className="h-4 w-4 text-green-500" />
      case "break": return <Clock className="h-4 w-4 text-yellow-500" />
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "complete": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "checkin": return <Activity className="h-4 w-4 text-blue-500" />
      case "cost": return <DollarSign className="h-4 w-4 text-orange-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{mockStats.activeStaff}</p>
              <p className="text-sm font-medium text-gray-600 mb-1">Staff Online</p>
              <p className="text-xs text-gray-500">of {mockStats.totalStaff} total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 mb-1">{mockStats.openShifts}</p>
              <p className="text-sm font-medium text-gray-600 mb-1">Open Shifts</p>
              <p className="text-xs text-red-600">Need immediate attention</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{mockStats.fillRate}%</p>
              <p className="text-sm font-medium text-gray-600 mb-1">Fill Rate</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 mb-1">${mockStats.todayStaffingCost}</p>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Staffing Cost</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Shifts Needing Coverage */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Shifts Needing Coverage</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Immediate action required</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUrgentShifts.length === 0 ? (
                <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold text-green-900 mb-2">All Shifts Covered!</h3>
                  <p className="text-sm text-green-700">No urgent shifts need attention right now</p>
                </div>
              ) : (
                mockUrgentShifts.map((shift) => (
                  <div key={shift.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${getUrgencyStyle(shift.urgency)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{shift.title}</h4>
                          <Badge className={`text-xs font-medium ${
                            shift.urgency === "critical" ? "bg-red-100 text-red-700" :
                            shift.urgency === "high" ? "bg-orange-100 text-orange-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {shift.urgency === "critical" ? "CRITICAL" : shift.urgency.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">Starts in {shift.timeUntil}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <div>
                              <p className="font-medium">{shift.location}</p>
                              <p className="text-xs text-gray-500">{shift.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <div>
                              <p className="font-medium">{shift.time}</p>
                              <p className="text-xs text-gray-500">8 hour shift</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">${shift.payRate}/hr</span>
                              <span className="text-gray-500 ml-1">• Total: ${shift.totalPay}</span>
                            </div>
                            <div className="text-sm font-medium text-red-600">
                              {shift.staffNeeded} worker{shift.staffNeeded > 1 ? "s" : ""} needed
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleFillShift(shift.id)}
                          className={`text-white ${
                            shift.urgency === "critical" ? "bg-red-500 hover:bg-red-600" :
                            "bg-orange-500 hover:bg-orange-600"
                          }`}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Find Staff
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Team */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Active Team</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{mockStats.activeStaff} working now</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
                >
                  {viewMode === "list" ? <Map className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockActiveStaff.map((staff) => {
                const statusInfo = getStatusInfo(staff.status)
                return (
                  <div key={staff.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                          {staff.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusInfo.color} rounded-full border-2 border-white`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate text-sm">{staff.name}</p>
                        <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
                          {staff.role}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {staff.location}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-500">
                          {staff.status === "arriving" ? (
                            <span className="text-blue-600 font-medium">ETA {staff.eta}</span>
                          ) : staff.status === "break" ? (
                            <span className="text-yellow-600 font-medium">Back at {staff.breakEnds}</span>
                          ) : (
                            <span>{staff.hoursWorked}h worked</span>
                          )}
                        </div>
                        {staff.currentCost && (
                          <div className="text-xs font-medium text-purple-600">
                            ${staff.currentCost}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleQuickMessage(staff.id)}
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Live Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="p-4 h-20 hover:bg-orange-50 hover:border-orange-300 flex-col"
              >
                <Calendar className="w-5 h-5 mb-2 text-orange-500" />
                <span className="font-medium text-sm">Create Shift</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-4 h-20 hover:bg-blue-50 hover:border-blue-300 flex-col"
              >
                <Users className="w-5 h-5 mb-2 text-blue-500" />
                <span className="font-medium text-sm">Find Workers</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-4 h-20 hover:bg-green-50 hover:border-green-300 flex-col"
              >
                <MessageCircle className="w-5 h-5 mb-2 text-green-500" />
                <span className="font-medium text-sm">Broadcast</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-4 h-20 hover:bg-purple-50 hover:border-purple-300 flex-col"
              >
                <TrendingUp className="w-5 h-5 mb-2 text-purple-500" />
                <span className="font-medium text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Live Activity</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAllActivity(!showAllActivity)}
              >
                {showAllActivity ? "Show Less" : "View All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(showAllActivity ? mockRecentActivity : mockRecentActivity.slice(0, 4)).map((activity, index) => (
                <div key={index} className={`flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  activity.priority === "critical" ? "bg-red-50 border border-red-200" :
                  activity.priority === "high" ? "bg-orange-50" : ""
                }`}>
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-800">{activity.message}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}