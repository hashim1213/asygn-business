"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  DollarSign,
  Star,
  MapPin,
  TrendingUp,
  Eye,
    ToggleLeft,
    ToggleRight,
    CheckCircle,
    AlertCircle

} from 'lucide-react'

// Mock data
const staffData = {
  profile: {
    name: "Alex Johnson",
    specialization: "Professional Bartender",
    rating: 4.8,
    totalJobs: 156,
    isAvailable: true
  },
  earnings: {
    today: 240,
    thisWeek: 1250,
    thisMonth: 4800
  },
  upcomingJobs: [
    {
      id: '1',
      title: 'Wedding Reception',
      venue: 'Malibu Creek State Park',
      date: '2024-12-28',
      startTime: '18:00',
      endTime: '23:00',
      hourlyRate: 42,
      status: 'confirmed',
      clientName: 'Sarah Johnson'
    },
    {
      id: '2',
      title: 'Corporate Holiday Party',
      venue: 'Downtown Event Center',
      date: '2024-12-30',
      startTime: '19:00',
      endTime: '01:00',
      hourlyRate: 45,
      status: 'pending',
      clientName: 'Tech Corp'
    }
  ],
  stats: {
    thisWeekHours: 32,
    completionRate: 98
  }
}

export default function StaffDashboard() {
  const [isAvailable, setIsAvailable] = useState(staffData.profile.isAvailable)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {staffData.profile.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            {staffData.profile.specialization} • {staffData.profile.totalJobs} jobs completed
          </p>
        </div>
        
        {/* Enhanced Availability Toggle */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Work Status</p>
                <p className={`text-sm ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'Available for jobs' : 'Not available'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleAvailability}
                className={`p-2 h-auto ${isAvailable ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {isAvailable ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
              </Button>
              <span className="text-xs text-gray-500">
                {isAvailable ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {isAvailable && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">You're visible to clients looking for staff</span>
              </div>
            </div>
          )}
          
          {!isAvailable && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">You won't receive new job requests</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${staffData.earnings.today}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">${staffData.earnings.thisWeek}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {staffData.stats.thisWeekHours} hours worked
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{staffData.profile.rating}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {staffData.stats.completionRate}% completion rate
          </div>
        </div>
      </div>

      {/* Upcoming Jobs - Now Full Width */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Jobs</h3>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Full Schedule
            </Button>
          </div>
        </div>
        <div className="p-6">
          {staffData.upcomingJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {staffData.upcomingJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-5 hover:border-orange-200 transition-colors hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">{job.title}</h4>
                      <Badge className={`${
                        job.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {job.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{job.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(job.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-2 text-gray-400" />
                      <span>{job.startTime} - {job.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">${job.hourlyRate}/hour</span>
                      <span className="text-gray-400">•</span>
                      <span>Client: {job.clientName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-900 mb-2">No upcoming jobs</h4>
              <p className="text-gray-600 mb-6">When you accept jobs, they'll appear here</p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2">
                Browse Available Jobs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}