"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, TrendingUp, MessageCircle, MapPin, Phone, Filter, Search, Map } from "lucide-react"
import { Input } from "@/components/ui/input"

const mockStaff = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Server",
    location: "Downtown Restaurant",
    status: "active" as const,
    checkInTime: "08:00",
    hoursWorked: 6.5,
    performance: 95,
    avatar: "/woman-server.png",
    coordinates: { lat: 49.8951, lng: -97.1384 }
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Bartender",
    location: "City Convention Center",
    status: "break" as const,
    checkInTime: "18:00",
    hoursWorked: 4.0,
    performance: 88,
    avatar: "/man-bartender.png",
    coordinates: { lat: 49.8865, lng: -97.1470 }
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Kitchen Assistant",
    location: "Uptown Bistro",
    status: "active" as const,
    checkInTime: "10:00",
    hoursWorked: 5.5,
    performance: 92,
    avatar: "/woman-chef-preparing-food.png",
    coordinates: { lat: 49.9012, lng: -97.1298 }
  },
  {
    id: 4,
    name: "David Miller",
    role: "Manager",
    location: "West Side Grill",
    status: "active" as const,
    checkInTime: "09:00",
    hoursWorked: 7.0,
    performance: 97,
    avatar: "/man-manager.png",
    coordinates: { lat: 49.8798, lng: -97.1589 }
  },
  {
    id: 5,
    name: "Lisa Wong",
    role: "Cashier",
    location: "Food Court Plaza",
    status: "offline" as const,
    checkInTime: "14:00",
    hoursWorked: 3.0,
    performance: 89,
    avatar: "/woman-cashier.png",
    coordinates: { lat: 49.8923, lng: -97.1512 }
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    role: "Chef",
    location: "Fine Dining House",
    status: "active" as const,
    checkInTime: "07:30",
    hoursWorked: 8.5,
    performance: 94,
    avatar: "/man-chef.png",
    coordinates: { lat: 49.8876, lng: -97.1234 }
  }
]

export function StaffContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200"
      case "break":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "offline":
        return "bg-gray-50 text-gray-600 border border-gray-200"
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200"
    }
  }

  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || staff.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search staff by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Broadcast Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">{mockStaff.filter(s => s.status === 'active').length}</p>
                <p className="text-xs text-green-600 mt-1">Currently working</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(mockStaff.reduce((acc, s) => acc + s.hoursWorked, 0) / mockStaff.length).toFixed(1)}
                </p>
                <p className="text-xs text-blue-600 mt-1">Per staff member</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mockStaff.reduce((acc, s) => acc + s.performance, 0) / mockStaff.length)}%
                </p>
                <p className="text-xs text-orange-600 mt-1">Team average</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(mockStaff.map(s => s.location)).size}</p>
                <p className="text-xs text-purple-600 mt-1">Active venues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border">
          {[
            { key: "all", label: "List View", icon: Users, count: mockStaff.length },
            { key: "map", label: "Map View", icon: Map, count: mockStaff.filter(s => s.status === 'active').length },
            { key: "active", label: "Active", icon: Clock, count: mockStaff.filter(s => s.status === 'active').length },
            { key: "break", label: "On Break", icon: Clock, count: mockStaff.filter(s => s.status === 'break').length },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <Badge variant="secondary" className={`text-xs ${
                  activeTab === tab.key ? "bg-orange-400 text-white" : "bg-gray-200"
                }`}>
                  {tab.count}
                </Badge>
              </button>
            )
          })}
        </div>
        
        <p className="text-sm text-gray-500">
          {filteredStaff.length} of {mockStaff.length} staff members
        </p>
      </div>

      {/* Map View */}
      {activeTab === "map" && (
        <Card className="h-96">
          <CardContent className="p-6 h-full">
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-900 mb-2">Interactive Map View</p>
                <p className="text-gray-500">Staff locations will be displayed here</p>
                <div className="mt-4 flex justify-center gap-4">
                  {mockStaff.filter(s => s.status === 'active').map((staff) => (
                    <div key={staff.id} className="bg-white p-3 rounded-lg shadow-sm border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium">{staff.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{staff.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Grid */}
      {activeTab !== "map" && (
        <div className="grid gap-6">
          {filteredStaff.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No staff found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "No staff members match the selected filter"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredStaff.map((staff) => (
              <Card key={staff.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                            {staff.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {staff.status === "active" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{staff.name}</h3>
                          <Badge className={`${getStatusColor(staff.status)} font-medium`}>
                            {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{staff.role}</span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {staff.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="grid grid-cols-3 gap-6 text-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Check-in</p>
                          <p className="text-lg font-bold text-gray-900">{staff.checkInTime}</p>
                        </div>
                        <div className="border-l border-gray-200 pl-6">
                          <p className="text-xs text-gray-500 mb-1">Hours</p>
                          <p className="text-lg font-bold text-gray-900">{staff.hoursWorked}h</p>
                        </div>
                        <div className="border-l border-gray-200 pl-6">
                          <p className="text-xs text-gray-500 mb-1">Performance</p>
                          <p className="text-lg font-bold text-green-600">{staff.performance}%</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Live Updates Feed */}
      <Card className="bg-gray-50 border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-gray-900">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            Live Activity Feed
            <div className="ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {[
              {
                type: "checkin",
                message: "Sarah Johnson checked in at Downtown Restaurant",
                time: "2 min ago",
                color: "green"
              },
              {
                type: "break",
                message: "Mike Chen started break at City Convention Center",
                time: "5 min ago",
                color: "yellow"
              },
              {
                type: "complete",
                message: "Emma Davis completed Kitchen Assistant shift",
                time: "12 min ago",
                color: "blue"
              },
              {
                type: "checkin",
                message: "Carlos Rodriguez checked in at Fine Dining House",
                time: "18 min ago",
                color: "green"
              },
              {
                type: "checkout",
                message: "Lisa Wong checked out from Food Court Plaza",
                time: "25 min ago",
                color: "gray"
              }
            ].map((update, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${update.color}-500 flex-shrink-0`}></div>
                  <span className="text-sm font-medium text-gray-700">{update.message}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">{update.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}