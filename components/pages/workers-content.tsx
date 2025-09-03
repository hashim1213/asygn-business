"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Music,
  Camera,
  Lightbulb,
  Coffee,
  Shield,
  CreditCard,
  MessageCircle,
  Award,
  Briefcase,
  Filter,
  Search
} from 'lucide-react'

// Type definitions
interface ProfessionalWorker {
  id: number
  name: string
  title: string
  rating: number
  reviewCount: number
  hourlyRate: number
  profileImage: string
  skills: string[]
  experience: string
  completedJobs: number
  distance: string
  available: boolean
  responseTime: string
  verified: boolean
  equipment: string[]
  bio: string
  nextAvailable?: string
}

interface EventDetails {
  eventType: string
  date: string
  startTime: string
  endTime: string
  location: string
  description: string
  budget: string
  guestCount: string
}

interface EventCategory {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface FeeBreakdown {
  subtotal: number
  serviceFee: number
  trustSafetyFee: number
  transactionFee: number
  asygnFee: number
  total: number
}

interface StepItem {
  step: number
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// Mock data for professional workers
const professionalWorkers: ProfessionalWorker[] = [
  {
    id: 1,
    name: "Marcus Rodriguez",
    title: "Professional DJ & Sound Engineer",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 85,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    skills: ["DJ", "Sound Engineering", "Wedding DJ", "Corporate Events", "Mixing", "Live Sound"],
    experience: "8+ years",
    completedJobs: 245,
    distance: "2.1 miles",
    available: true,
    responseTime: "within 1 hour",
    verified: true,
    equipment: ["Professional DJ Setup", "Sound System", "Microphones", "Lighting"],
    bio: "Professional DJ with 8+ years of experience in corporate events, weddings, and festivals. Specializing in creating the perfect atmosphere for any occasion."
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Event Photographer & Videographer",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 125,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=150&h=150&fit=crop&crop=face",
    skills: ["Event Photography", "Videography", "Wedding Photography", "Corporate Events", "Drone Photography"],
    experience: "6+ years",
    completedJobs: 156,
    distance: "1.8 miles",
    available: true,
    responseTime: "within 30 minutes",
    verified: true,
    equipment: ["Professional Cameras", "Drone", "Lighting Equipment", "Editing Software"],
    bio: "Award-winning photographer and videographer specializing in capturing unforgettable moments at corporate events and celebrations."
  },
  {
    id: 3,
    name: "Jake Thompson",
    title: "Professional Bartender & Mixologist",
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 65,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    skills: ["Bartending", "Mixology", "Wine Service", "Corporate Events", "Wedding Bartending", "Craft Cocktails"],
    experience: "5+ years",
    completedJobs: 198,
    distance: "3.2 miles",
    available: true,
    responseTime: "within 2 hours",
    verified: true,
    equipment: ["Bar Tools", "Portable Bar Setup", "Premium Spirits Knowledge"],
    bio: "Expert mixologist and bartender with extensive experience in high-end events, corporate functions, and private parties."
  },
  {
    id: 4,
    name: "Alex Rivera",
    title: "Lighting Designer & Technician",
    rating: 4.9,
    reviewCount: 73,
    hourlyRate: 95,
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    skills: ["Lighting Design", "Stage Lighting", "LED Systems", "Concert Lighting", "Corporate Events"],
    experience: "7+ years",
    completedJobs: 134,
    distance: "4.1 miles",
    available: false,
    nextAvailable: "Tomorrow",
    responseTime: "within 1 hour",
    verified: true,
    equipment: ["Professional Lighting Rig", "LED Systems", "Control Boards", "Special Effects"],
    bio: "Creative lighting designer with expertise in transforming spaces through innovative lighting solutions for events of all scales."
  }
]

const eventCategories: EventCategory[] = [
  { name: "DJ", icon: Music, color: "bg-purple-100 text-purple-700" },
  { name: "Photography", icon: Camera, color: "bg-blue-100 text-blue-700" },
  { name: "Bartending", icon: Coffee, color: "bg-green-100 text-green-700" },
  { name: "Lighting", icon: Lightbulb, color: "bg-yellow-100 text-yellow-700" },
  { name: "Band", icon: Music, color: "bg-red-100 text-red-700" },
  { name: "Videography", icon: Camera, color: "bg-indigo-100 text-indigo-700" }
]

export default function WorkersContent() {
  const [currentStep, setCurrentStep] = useState<number>(1) // 1: Browse, 2: Details, 3: Request, 4: Payment
  const [selectedWorker, setSelectedWorker] = useState<ProfessionalWorker | null>(null)
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    budget: '',
    guestCount: ''
  })
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [requestDetails, setRequestDetails] = useState<string>('')

  const filteredWorkers: ProfessionalWorker[] = professionalWorkers.filter(worker => {
    const matchesSearch = searchQuery === '' || 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      worker.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      worker.skills.some((skill: string) => skill.toLowerCase().includes(selectedCategory.toLowerCase()))
    
    return matchesSearch && matchesCategory
  })

  const calculateFees = (rate: number, hours: number = 4): FeeBreakdown => {
    const subtotal = rate * hours
    const serviceFee = subtotal * 0.15
    const trustSafetyFee = subtotal * 0.08
    const transactionFee = subtotal * 0.02
    const asygnFee = subtotal * 0.25
    const total = subtotal + serviceFee + trustSafetyFee + transactionFee + asygnFee
    
    return {
      subtotal,
      serviceFee,
      trustSafetyFee,
      transactionFee,
      asygnFee,
      total
    }
  }

  const handleWorkerSelect = (worker: ProfessionalWorker): void => {
    setSelectedWorker(worker)
    setCurrentStep(2)
  }

  const handleSendRequest = (): void => {
    setCurrentStep(3)
    // Simulate request being sent
    setTimeout(() => {
      setCurrentStep(4)
    }, 2000)
  }

  const renderBrowseStep = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Professional Event Staff</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hire verified DJs, photographers, bartenders, lighting technicians, and more for your events
        </p>
      </div>

      {/* Search and Categories */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, skill, or service type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Professionals
            </button>
            {eventCategories.map((category: EventCategory) => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.name 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{filteredWorkers.length}</div>
            <div className="text-sm text-gray-600">Available Pros</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{filteredWorkers.filter(w => w.available).length}</div>
            <div className="text-sm text-gray-600">Available Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-gray-600">Verified</div>
          </CardContent>
        </Card>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker: ProfessionalWorker) => (
          <Card key={worker.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={worker.profileImage}
                    alt={worker.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {worker.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{worker.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{worker.rating}</span>
                      <span className="text-sm text-gray-500">({worker.reviewCount})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{worker.title}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {worker.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {worker.completedJobs} jobs
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {worker.skills.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{worker.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{worker.bio}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">${worker.hourlyRate}</div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleWorkerSelect(worker)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Select & Continue
                  </Button>
                </div>
              </div>
              
              {worker.available ? (
                <div className="flex items-center gap-2 mt-3 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Available - responds {worker.responseTime}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3 text-orange-600 text-sm">
                  <Clock className="w-4 h-4" />
                  Next available: {worker.nextAvailable}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>
        <h2 className="text-2xl font-bold">Event Details & Request</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selected Worker Info */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Professional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-4">
              <img
                src={selectedWorker?.profileImage}
                alt={selectedWorker?.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{selectedWorker?.name}</h3>
                <p className="text-gray-600 mb-2">{selectedWorker?.title}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedWorker?.rating}</span>
                  <span className="text-gray-500">({selectedWorker?.reviewCount} reviews)</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  ${selectedWorker?.hourlyRate}/hour
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedWorker?.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Equipment Provided</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedWorker?.equipment.map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                value={eventDetails.eventType}
                onChange={(e) => setEventDetails({...eventDetails, eventType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="birthday">Birthday Party</option>
                <option value="festival">Festival</option>
                <option value="concert">Concert</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventDetails.date}
                  onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Guest Count</label>
                <input
                  type="number"
                  placeholder="Expected guests"
                  value={eventDetails.guestCount}
                  onChange={(e) => setEventDetails({...eventDetails, guestCount: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <input
                  type="time"
                  value={eventDetails.startTime}
                  onChange={(e) => setEventDetails({...eventDetails, startTime: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  value={eventDetails.endTime}
                  onChange={(e) => setEventDetails({...eventDetails, endTime: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event Location</label>
              <input
                type="text"
                placeholder="Venue address or location"
                value={eventDetails.location}
                onChange={(e) => setEventDetails({...eventDetails, location: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Details</label>
              <textarea
                rows={4}
                placeholder="Describe your event, special requirements, music preferences, etc."
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <Button 
              onClick={handleSendRequest}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              disabled={!eventDetails.eventType || !eventDetails.date || !eventDetails.location}
            >
              Send Request
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderRequestStep = () => (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="animate-pulse">
        <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Sending Your Request...</h2>
        <p className="text-gray-600 mb-6">
          We're sending your event details to {selectedWorker?.name}. They typically respond within {selectedWorker?.responseTime}.
        </p>
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
        </div>
      </div>
    </div>
  )

  const renderPaymentStep = () => {
    const estimatedHours = 4 // This could be calculated from start/end time
    const fees = calculateFees(selectedWorker?.hourlyRate || 0, estimatedHours)

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-3xl font-bold mb-2">Request Accepted!</h2>
          <p className="text-lg text-gray-600">
            {selectedWorker?.name} has accepted your request and is ready to work your event.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorker?.profileImage}
                  alt={selectedWorker?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{selectedWorker?.name}</div>
                  <div className="text-sm text-gray-600">{selectedWorker?.title}</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Type:</span>
                  <span className="capitalize">{eventDetails.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(eventDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>{eventDetails.startTime} - {eventDetails.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="text-right">{eventDetails.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Duration:</span>
                  <span>{estimatedHours} hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Service ({estimatedHours} hours @ ${selectedWorker?.hourlyRate}/hr)</span>
                  <span>${fees.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee (15%)</span>
                    <span>${fees.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trust & Safety Fee (8%)</span>
                    <span>${fees.trustSafetyFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transaction Fee (2%)</span>
                    <span>${fees.transactionFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Asygn Platform Fee (25%)</span>
                    <span>${fees.asygnFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${fees.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">Payment Protection</div>
                    <div className="text-blue-700">
                      Your payment is held securely until the service is completed. 
                      Full refund if the professional doesn't show up.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span>•••• •••• •••• 4242</span>
                    <span className="ml-auto text-sm text-blue-600 cursor-pointer">Change</span>
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg">
                  Confirm & Pay ${fees.total.toFixed(2)}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  By confirming, you agree to Asygn's Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderStepIndicator = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        {[
          { step: 1, label: "Browse Professionals", icon: Users },
          { step: 2, label: "Event Details", icon: Calendar },
          { step: 3, label: "Send Request", icon: MessageCircle },
          { step: 4, label: "Payment", icon: CreditCard }
        ].map((item: StepItem, index: number) => {
          const Icon = item.icon
          const isActive = currentStep === item.step
          const isCompleted = currentStep > item.step
          
          return (
            <div key={item.step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                isActive ? 'bg-orange-500 border-orange-500 text-white' :
                'bg-white border-gray-300 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className={`ml-3 ${isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                <div className="text-sm font-medium">{item.label}</div>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-px mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Main Content */}
      {currentStep === 1 && renderBrowseStep()}
      {currentStep === 2 && renderDetailsStep()}
      {currentStep === 3 && renderRequestStep()}
      {currentStep === 4 && renderPaymentStep()}
    </div>
  )
}