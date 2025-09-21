"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Award,
  TrendingUp,
  Users,
  Coffee,
  Utensils,
  Package,
  Headphones,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Share2,
  MoreVertical,
  Edit,
  Flag,
  Download,
  Calendar as CalendarIcon,
  Clock3,
  MapIcon,
  Briefcase,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  Heart,
  Send,
  FileText,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'

interface StaffProfile {
  id: string
  name: string
  email: string
  phone: string
  profileImg: string
  role: string
  staffType: 'BARTENDER' | 'SERVER' | 'BARBACK' | 'EVENT_CREW'
  hourlyRate: number
  rating: number
  totalRatings: number
  experience: string
  bio: string
  skills: string[]
  certifications: string[]
  languages: string[]
  location: string
  joinDate: string
  verified: boolean
  available: boolean
  backgroundCheck: boolean
  profileViews: number
  jobsCompleted: number
  totalEarnings: number
  responseTime: string
  lastActive: string
  availability: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  portfolio: Array<{
    id: string
    type: 'image' | 'video'
    url: string
    caption: string
    eventType: string
  }>
  recentJobs: Array<{
    id: string
    eventTitle: string
    date: string
    venue: string
    rating: number
    review?: string
    clientName: string
  }>
  reviews: Array<{
    id: string
    clientName: string
    rating: number
    review: string
    date: string
    eventType: string
    verified: boolean
  }>
}

const getStaffIcon = (staffType: string) => {
  switch (staffType) {
    case 'BARTENDER': return Coffee
    case 'SERVER': return Utensils
    case 'BARBACK': return Package
    case 'EVENT_CREW': return Headphones
    default: return Users
  }
}

export default function StaffProfile({ staffId }: { staffId: string }) {
  const [staff, setStaff] = useState<StaffProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'portfolio' | 'availability'>('overview')
  const [messageText, setMessageText] = useState('')
  const [showContactInfo, setShowContactInfo] = useState(false)

  useEffect(() => {
    fetchStaffProfile()
  }, [staffId])

  const fetchStaffProfile = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      const response = await fetch(`/api/staff/${staffId}`)
      
      if (response.ok) {
        const data = await response.json()
        setStaff(data.staff)
      } else {
        console.error('Failed to fetch staff profile')
      }
    } catch (error) {
      console.error('Error fetching staff profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim()) return
    
    try {
      const response = await fetch(`/api/staff/${staffId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      })

      if (response.ok) {
        setMessageText('')
        // Show success message or handle response
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
          <p className="text-gray-600">Loading staff profile...</p>
        </div>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600 mb-4">The staff member you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const Icon = getStaffIcon(staff.staffType)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="p-2 mt-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={staff.profileImg}
                    alt={staff.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {staff.verified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{staff.name}</h1>
                    {staff.available ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-gray-900">{staff.role}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{staff.rating}</span>
                      <span className="text-gray-500">({staff.totalRatings} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">${staff.hourlyRate}/hour</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{staff.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(staff.joinDate).getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Responds in {staff.responseTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    {staff.verified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {staff.backgroundCheck && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Background Checked
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="p-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'reviews', label: 'Reviews', count: staff.totalRatings },
                { id: 'portfolio', label: 'Portfolio', count: staff.portfolio.length },
                { id: 'availability', label: 'Availability' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed">{staff.bio}</p>
              </div>

              {/* Skills & Certifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Certifications</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {staff.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {staff.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {staff.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
                <div className="space-y-4">
                  {staff.recentJobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.eventTitle}</h4>
                        <div className="text-sm text-gray-600">
                          {job.venue} • {new Date(job.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">Client: {job.clientName}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{job.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jobs Completed</span>
                    <span className="font-medium">{staff.jobsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings</span>
                    <span className="font-medium">${staff.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-medium">{staff.profileViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active</span>
                    <span className="font-medium">{staff.lastActive}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="p-1"
                  >
                    {showContactInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                {showContactInfo ? (
                  <div className="space-y-3">
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-900">{staff.phone}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                    </a>
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-900">{staff.email}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Contact information is hidden. Click the eye icon to reveal.</p>
                )}
              </div>

              {/* Quick Message */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
                <div className="space-y-3">
                  <textarea
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                  <Button
                    onClick={sendMessage}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reviews ({staff.totalRatings})
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{staff.rating}</span>
                  <span className="text-gray-500">out of 5</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {staff.reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                          {review.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{review.eventType}</span>
                          <span>•</span>
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.portfolio.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <ImageIcon className="w-6 h-6 text-orange-600" />
                          </div>
                          <span className="text-sm text-gray-600">Video Content</span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-900 mb-1">{item.caption}</p>
                      <p className="text-xs text-gray-500">{item.eventType}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Availability</h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(staff.availability).map(([day, available]) => (
                  <div key={day} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                    <Badge className={available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}