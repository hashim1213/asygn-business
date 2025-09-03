"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { MapPin, X, Search, CheckCircle, ChevronDown, ChevronRight, ChevronLeft, CreditCard, ArrowLeft, Maximize2, Minimize2, Filter, Star, Users, Clock, DollarSign, Phone, Mail, Calendar, FileText } from "lucide-react"

// Types
interface CreateShiftModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialShift?: Partial<ShiftDetails>
  startFromStaff?: boolean
}

interface ShiftDetails {
  title: string
  location: string
  useCurrentLocation: boolean
  date: string
  startTime: string
  endTime: string
  hourlyRate: string
  staffNeeded: string
  staffType: string
  workerType: "regular" | "pro"
  dressAttire: string
  description: string
  specialRequirements: string[]
}

interface StaffMember {
  id: string
  name: string
  avatar: string
  rating: number
  experience: string
  distance: string
  hourlyRate: number
  skills: string[]
  available: boolean
  completedShifts: number
  responseTime: string
  verifications: string[]
  bio: string
  availability: string[]
}

type Phase = 'basic' | 'requirements' | 'schedule' | 'staff' | 'success' | 'hire' | 'payment'

// Constants
const STAFF_TYPES = [
  "Server", "Bartender", "Host/Hostess", "Cook", "Kitchen Assistant", "Dishwasher",
  "Barista", "Cashier", "Food Runner", "Busser", "Event Staff", "Catering Server",
  "Line Cook", "Prep Cook", "Sous Chef", "Manager", "Security", "Cleaner",
  "Delivery Driver", "Warehouse Worker", "Retail Associate", "Customer Service"
]

const DRESS_ATTIRE = [
  "Business Casual", "Business Professional", "Uniform Provided", "Black Shirt & Black Pants",
  "White Shirt & Black Pants", "Casual", "Smart Casual", "All Black", "Chef Whites",
  "Company Uniform", "Formal", "Semi-Formal"
]

const SPECIAL_REQUIREMENTS = [
  "Food Safety Certification", "Alcohol Service License", "Previous Experience Required",
  "Physical Lifting Required", "Bilingual Preferred", "Own Transportation",
  "Background Check Required", "Weekend Availability", "Fine Dining Experience"
]

const INITIAL_SHIFT_STATE: ShiftDetails = {
  title: "",
  location: "",
  useCurrentLocation: false,
  date: "",
  startTime: "",
  endTime: "",
  hourlyRate: "",
  staffNeeded: "",
  staffType: "",
  workerType: "regular",
  dressAttire: "",
  description: "",
  specialRequirements: []
}

// Enhanced mock data for available staff
const MOCK_AVAILABLE_STAFF: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    rating: 4.9,
    experience: "5+ years",
    distance: "2.3 miles",
    hourlyRate: 22,
    skills: ["Server", "Fine Dining Experience", "Bilingual Preferred", "Food Safety Certification"],
    available: true,
    completedShifts: 156,
    responseTime: "Usually responds in 15 minutes",
    verifications: ["Background Check", "Food Safety Certified", "References Verified"],
    bio: "Experienced fine dining server with excellent customer service skills and bilingual capabilities.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "MC",
    rating: 4.7,
    experience: "3+ years",
    distance: "1.8 miles",
    hourlyRate: 20,
    skills: ["Bartender", "Alcohol Service License", "Previous Experience Required"],
    available: true,
    completedShifts: 89,
    responseTime: "Usually responds in 30 minutes",
    verifications: ["Alcohol License", "Background Check"],
    bio: "Professional bartender specializing in craft cocktails and high-volume service.",
    availability: ["Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    avatar: "LR",
    rating: 4.8,
    experience: "4+ years",
    distance: "3.1 miles",
    hourlyRate: 24,
    skills: ["Server", "Host/Hostess", "Previous Experience Required", "Fine Dining Experience"],
    available: true,
    completedShifts: 203,
    responseTime: "Usually responds in 10 minutes",
    verifications: ["Background Check", "Food Safety Certified", "References Verified"],
    bio: "Versatile hospitality professional with expertise in both front-of-house and host duties.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "DK",
    rating: 4.6,
    experience: "2+ years",
    distance: "1.2 miles",
    hourlyRate: 18,
    skills: ["Cook", "Kitchen Assistant", "Food Safety Certification"],
    available: true,
    completedShifts: 67,
    responseTime: "Usually responds in 1 hour",
    verifications: ["Food Safety Certified"],
    bio: "Reliable kitchen staff with strong food prep and cooking fundamentals.",
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: "5",
    name: "Amanda Torres",
    avatar: "AT",
    rating: 4.9,
    experience: "6+ years",
    distance: "4.5 miles",
    hourlyRate: 26,
    skills: ["Server", "Manager", "Fine Dining Experience", "Previous Experience Required"],
    available: true,
    completedShifts: 312,
    responseTime: "Usually responds in 5 minutes",
    verifications: ["Background Check", "Food Safety Certified", "References Verified", "Management Certified"],
    bio: "Senior hospitality professional with management experience and exceptional service standards.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }
]

export function CreateShiftModal({ open, onOpenChange, initialShift, startFromStaff = false }: CreateShiftModalProps) {
  // State
  const [currentPhase, setCurrentPhase] = useState<Phase>('basic')
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [newShift, setNewShift] = useState<ShiftDetails>({ ...INITIAL_SHIFT_STATE, ...initialShift })
  const [staffTypeSearch, setStaffTypeSearch] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [staffSelectionMode, setStaffSelectionMode] = useState<'auto' | 'manual'>('auto')
  
  // Staff filtering state
  const [staffFilters, setStaffFilters] = useState({
    minRating: 0,
    maxDistance: 50,
    maxRate: 100,
    skills: [] as string[],
    verifications: [] as string[],
    sortBy: 'rating' as 'rating' | 'distance' | 'rate' | 'experience'
  })

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setIsExpanded(false)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Utility Functions
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
        times.push({ value: time24, label: time12 })
      }
    }
    return times
  }

  const calculateShiftHours = () => {
    if (!newShift.startTime || !newShift.endTime) return 0
    
    const [startHour, startMinute] = newShift.startTime.split(':').map(Number)
    const [endHour, endMinute] = newShift.endTime.split(':').map(Number)
    
    let startTotalMinutes = startHour * 60 + startMinute
    let endTotalMinutes = endHour * 60 + endMinute
    
    if (endTotalMinutes <= startTotalMinutes) {
      endTotalMinutes += 24 * 60
    }
    
    const totalMinutes = endTotalMinutes - startTotalMinutes
    return totalMinutes / 60
  }

  const calculateFees = () => {
    const hourlyRate = parseFloat(newShift.hourlyRate) || 0
    const hours = calculateShiftHours()
    const staffCount = parseInt(newShift.staffNeeded) || 1
    const basePay = hourlyRate * hours * staffCount
    
    if (newShift.workerType === "pro") {
      const serviceFee = basePay * 0.25
      return {
        basePay,
        serviceFee,
        trustSafetyFee: 0,
        transactionFee: 0,
        total: basePay + serviceFee
      }
    } else {
      const serviceFee = basePay * 0.15
      const trustSafetyFee = basePay * 0.08
      const transactionFee = basePay * 0.02
      return {
        basePay,
        serviceFee,
        trustSafetyFee,
        transactionFee,
        total: basePay + serviceFee + trustSafetyFee + transactionFee
      }
    }
  }

  const getFilteredStaff = () => {
    return MOCK_AVAILABLE_STAFF.filter(staff => {
      const matchesType = !newShift.staffType || staff.skills.includes(newShift.staffType)
      const matchesRequirements = newShift.specialRequirements.length === 0 || 
        newShift.specialRequirements.some(req => staff.skills.includes(req) || staff.verifications.includes(req))
      const matchesRate = !newShift.hourlyRate || staff.hourlyRate <= parseFloat(newShift.hourlyRate)
      const matchesFilters = staff.rating >= staffFilters.minRating &&
        parseFloat(staff.distance) <= staffFilters.maxDistance &&
        staff.hourlyRate <= staffFilters.maxRate
      const matchesSkillFilter = staffFilters.skills.length === 0 ||
        staffFilters.skills.some(skill => staff.skills.includes(skill))
      const matchesVerificationFilter = staffFilters.verifications.length === 0 ||
        staffFilters.verifications.some(verification => staff.verifications.includes(verification))
      
      return matchesType && matchesRequirements && matchesRate && matchesFilters && 
             matchesSkillFilter && matchesVerificationFilter && staff.available
    }).sort((a, b) => {
      switch (staffFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'rate':
          return a.hourlyRate - b.hourlyRate
        case 'experience':
          return b.completedShifts - a.completedShifts
        default:
          return b.rating - a.rating
      }
    })
  }

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'basic': return 'Basic Information'
      case 'requirements': return 'Requirements'  
      case 'schedule': return 'Schedule & Pricing'
      case 'staff': return 'Find Staff'
      case 'hire': return 'Hire Workers'
      case 'payment': return 'Confirm & Pay'
      default: return 'Create Shift'
    }
  }

  const handleAutoSelectStaff = () => {
    const filtered = getFilteredStaff()
    const needed = parseInt(newShift.staffNeeded) || 1
    const autoSelected = filtered.slice(0, needed).map(staff => staff.id)
    setSelectedWorkers(autoSelected)
  }

  const handleManualStaffToggle = (staffId: string) => {
    setSelectedWorkers(prev => {
      const needed = parseInt(newShift.staffNeeded) || 1
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId)
      } else if (prev.length < needed) {
        return [...prev, staffId]
      }
      return prev
    })
  }

  // Event Handlers
  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCreateShift = () => {
    console.log("Creating shift:", newShift)
    setCurrentPhase('success')
  }

  const handleHireNow = () => {
    setCurrentPhase('staff')
  }

  const handleRequestLater = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleWorkerHired = (workerId: string) => {
    setSelectedWorkers(prev => {
      if (!prev.includes(workerId)) {
        const newSelected = [...prev, workerId]
        
        if (newSelected.length === parseInt(newShift.staffNeeded)) {
          setTimeout(() => setCurrentPhase('payment'), 500)
        }
        
        return newSelected
      }
      return prev.filter(id => id !== workerId)
    })
  }

  const handlePaymentComplete = () => {
    console.log("Payment completed for workers:", selectedWorkers)
    alert("Payment successful! Workers have been notified and funds are on hold until shift completion.")
    onOpenChange(false)
    resetForm()
  }

  const getCurrentLocation = () => {
    setNewShift(prev => ({
      ...prev,
      location: "Current Location (123 Main St, City, State)",
      useCurrentLocation: true
    }))
  }

  const addSpecialRequirement = (requirement: string) => {
    if (requirement && !newShift.specialRequirements.includes(requirement)) {
      setNewShift(prev => ({
        ...prev,
        specialRequirements: [...prev.specialRequirements, requirement]
      }))
    }
  }

  const removeSpecialRequirement = (requirement: string) => {
    setNewShift(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.filter(req => req !== requirement)
    }))
  }

  const resetForm = () => {
    setNewShift(INITIAL_SHIFT_STATE)
    setCurrentPhase('basic')
    setSelectedWorkers([])
    setStaffTypeSearch("")
    setShowFeeBreakdown(false)
    setIsExpanded(false)
    setStaffFilters({
      minRating: 0,
      maxDistance: 50,
      maxRate: 100,
      skills: [],
      verifications: [],
      sortBy: 'rating'
    })
  }

  const navigatePhase = (direction: 'next' | 'back') => {
    const phases: Phase[] = ['basic', 'requirements', 'schedule', 'staff']
    const currentIndex = phases.indexOf(currentPhase as any)
    
    if (direction === 'next' && currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1])
    } else if (direction === 'back' && currentIndex > 0) {
      setCurrentPhase(phases[currentIndex - 1])
    }
  }

  const canNavigateNext = () => {
    switch (currentPhase) {
      case 'basic':
        return newShift.title && newShift.location && newShift.staffType
      case 'requirements':
        return newShift.dressAttire
      case 'schedule':
        return newShift.date && newShift.startTime && newShift.endTime && newShift.hourlyRate && newShift.staffNeeded
      case 'staff':
        return selectedWorkers.length > 0
      default:
        return true
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Computed Values
  const timeOptions = generateTimeOptions()
  const fees = calculateFees()
  const filteredStaffTypes = STAFF_TYPES.filter(type => 
    type.toLowerCase().includes(staffTypeSearch.toLowerCase())
  )
  const filteredStaff = getFilteredStaff()

  // Render Special Phases
  if (currentPhase === 'success') {
    return (
      <>
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            open ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => onOpenChange(false)}
        />
        
        <div 
          className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out ${
            open ? 'translate-y-0' : 'translate-y-full'
          } top-[30vh]`}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="text-center py-12 px-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Shift Created Successfully!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your shift "{newShift.title}" has been created and is ready for staff assignment.
            </p>
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Button 
                onClick={handleHireNow}
                className="bg-orange-500 hover:bg-orange-600 text-white h-12"
              >
                Find Staff Now
              </Button>
              <Button variant="outline" onClick={handleRequestLater} className="h-12">
                Find Staff Later
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (currentPhase === 'payment') {
    return (
      <>
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            open ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => onOpenChange(false)}
        />
        
        <div 
          className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out ${
            isExpanded 
              ? 'top-0 rounded-t-none' 
              : 'top-[20vh]'
          } ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPhase('staff')}
                  className="p-1 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-bold text-gray-900">Confirm & Pay</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExpand}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className={`overflow-y-auto ${isExpanded ? 'h-full pb-6' : 'max-h-[70vh]'}`}>
            <div className="p-6 space-y-6 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Ready to hire {selectedWorkers.length} workers
                </h3>
                <p className="text-gray-600 text-sm">
                  Payment will be held securely until the shift is completed
                </p>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Shift Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shift</span>
                      <span className="font-medium">{newShift.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-medium">
                        {formatDate(newShift.date)} • {calculateShiftHours().toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-right max-w-48 truncate">{newShift.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Staff Type</span>
                      <span className="font-medium">{newShift.staffType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Pay ({calculateShiftHours().toFixed(1)}h × ${newShift.hourlyRate} × {newShift.staffNeeded})</span>
                      <span>${fees.basePay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee ({newShift.workerType === "pro" ? "25%" : "15%"})</span>
                      <span>${fees.serviceFee.toFixed(2)}</span>
                    </div>
                    {newShift.workerType === "regular" && (
                      <>
                        <div className="flex justify-between">
                          <span>Trust & Safety Fee (8%)</span>
                          <span>${fees.trustSafetyFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction Fee (2%)</span>
                          <span>${fees.transactionFee.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">${fees.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Payment Protection</h4>
                    <p className="text-sm text-blue-700">
                      Your payment is held securely and only released when the shift is completed successfully. 
                      If workers don't show up or cancel, you'll receive a full refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentPhase('staff')}>
                  Back to Staff Selection
                </Button>
                <Button onClick={handlePaymentComplete} className="bg-orange-500 hover:bg-orange-600 flex-1">
                  Confirm & Pay ${fees.total.toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Main Modal - Full Page Style
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          open ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Full Page Sheet */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out ${
          isExpanded 
            ? 'top-0 rounded-t-none' 
            : 'top-[10vh]'
        } ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Shift - {getPhaseTitle()}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {['basic', 'requirements', 'schedule', 'staff'].map((phase, index) => (
              <div key={phase} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentPhase === phase 
                    ? 'bg-orange-500 text-white' 
                    : index < ['basic', 'requirements', 'schedule', 'staff'].indexOf(currentPhase)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < ['basic', 'requirements', 'schedule', 'staff'].indexOf(currentPhase)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto ${isExpanded ? 'h-full pb-6' : 'max-h-[80vh]'}`}>
          <div className="p-6 space-y-8">
            
            {/* Basic Information Phase */}
            {currentPhase === 'basic' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Shift Title *</Label>
                    <Input
                      id="title"
                      value={newShift.title}
                      onChange={(e) => setNewShift(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Evening Server - Fine Dining"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newShift.location}
                        onChange={(e) => setNewShift(prev => ({ 
                          ...prev, 
                          location: e.target.value, 
                          useCurrentLocation: false 
                        }))}
                        placeholder="Enter restaurant or venue address"
                        className="flex-1"
                        required
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Use Current
                      </Button>
                    </div>
                    {newShift.useCurrentLocation && (
                      <p className="text-sm text-green-600">Using your current location</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Staff Type *</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search staff types..."
                          value={staffTypeSearch}
                          onChange={(e) => setStaffTypeSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select 
                        value={newShift.staffType} 
                        onValueChange={(value) => setNewShift(prev => ({ ...prev, staffType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredStaffTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements Phase */}
            {currentPhase === 'requirements' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Dress Attire *</Label>
                    <Select 
                      value={newShift.dressAttire} 
                      onValueChange={(value) => setNewShift(prev => ({ ...prev, dressAttire: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dress attire" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRESS_ATTIRE.map((attire) => (
                          <SelectItem key={attire} value={attire}>{attire}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Work Description</Label>
                    <Textarea
                      id="description"
                      value={newShift.description}
                      onChange={(e) => setNewShift(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the work responsibilities, environment, and expectations..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Special Requirements</Label>
                    <Select onValueChange={addSpecialRequirement}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add special requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIAL_REQUIREMENTS.map((req) => (
                          <SelectItem key={req} value={req}>{req}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newShift.specialRequirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                          <button
                            onClick={() => removeSpecialRequirement(req)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule & Pricing Phase */}
            {currentPhase === 'schedule' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newShift.date}
                        onChange={(e) => setNewShift(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time *</Label>
                      <Select 
                        value={newShift.startTime} 
                        onValueChange={(value) => setNewShift(prev => ({ ...prev, startTime: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time *</Label>
                      <Select 
                        value={newShift.endTime} 
                        onValueChange={(value) => setNewShift(prev => ({ ...prev, endTime: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Worker Type</Label>
                    <RadioGroup 
                      value={newShift.workerType} 
                      onValueChange={(value: "regular" | "pro") => 
                        setNewShift(prev => ({ ...prev, workerType: value }))
                      }
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-3 border rounded-lg p-4">
                        <RadioGroupItem value="regular" id="regular" />
                        <div className="flex-1">
                          <Label htmlFor="regular" className="font-medium">Regular Worker</Label>
                          <p className="text-sm text-gray-600">
                            Skilled workers with standard verification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                        <RadioGroupItem value="pro" id="pro" />
                        <div className="flex-1">
                          <Label htmlFor="pro" className="font-medium text-orange-700">Asygn Pro</Label>
                          <p className="text-sm text-orange-600">
                            100% vetted skills by our team - Premium quality
                          </p>
                        </div>
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Pro</Badge>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">
                        {newShift.workerType === "pro" ? "Budget Range *" : "Hourly Rate *"}
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="15"
                        max="100"
                        step="0.50"
                        value={newShift.hourlyRate}
                        onChange={(e) => setNewShift(prev => ({ ...prev, hourlyRate: e.target.value }))}
                        placeholder={newShift.workerType === "pro" ? "25" : "18"}
                        required
                      />
                      {newShift.workerType === "pro" && (
                        <p className="text-xs text-orange-600">
                          Pros set their own rates within your budget
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staffNeeded">Staff Needed *</Label>
                      <Input
                        id="staffNeeded"
                        type="number"
                        min="1"
                        max="20"
                        value={newShift.staffNeeded}
                        onChange={(e) => setNewShift(prev => ({ ...prev, staffNeeded: e.target.value }))}
                        placeholder="1"
                        required
                      />
                    </div>
                  </div>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg">Total Cost</h3>
                          {newShift.hourlyRate && newShift.staffNeeded && newShift.startTime && newShift.endTime ? (
                            <p className="text-sm text-gray-600">
                              {calculateShiftHours().toFixed(1)}h × ${newShift.hourlyRate} × {newShift.staffNeeded} staff + fees
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Enter details above to calculate cost
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${fees.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {fees.total > 0 && (
                        <Collapsible open={showFeeBreakdown} onOpenChange={setShowFeeBreakdown}>
                          <CollapsibleTrigger className="flex items-center gap-2 mt-3 text-sm text-gray-600 hover:text-gray-900 w-full justify-center border-t pt-3">
                            {showFeeBreakdown ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            View fee breakdown
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3 pt-3 border-t">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Base Pay ({calculateShiftHours().toFixed(1)}h × ${newShift.hourlyRate} × {newShift.staffNeeded})</span>
                                <span>${fees.basePay.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Service Fee ({newShift.workerType === "pro" ? "25%" : "15%"})</span>
                                <span>${fees.serviceFee.toFixed(2)}</span>
                              </div>
                              {newShift.workerType === "regular" && (
                                <>
                                  <div className="flex justify-between">
                                    <span>Trust & Safety Fee (8%)</span>
                                    <span>${fees.trustSafetyFee.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Transaction Fee (2%)</span>
                                    <span>${fees.transactionFee.toFixed(2)}</span>
                                  </div>
                                </>
                              )}
                              <div className="flex justify-between font-medium text-base pt-2 border-t">
                                <span>Total</span>
                                <span>${fees.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Enhanced Staff Selection Phase */}
            {currentPhase === 'staff' && (
              <div className="space-y-8">
                {/* Quick Stats Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-900">{calculateShiftHours().toFixed(1)}h</div>
                      <div className="text-sm text-blue-700">Duration</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-green-900">${newShift.hourlyRate}</div>
                      <div className="text-sm text-green-700">Budget</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-purple-900">{selectedWorkers.length}/{newShift.staffNeeded}</div>
                      <div className="text-sm text-purple-700">Selected</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4 text-center">
                      <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-orange-900">{filteredStaff.length}</div>
                      <div className="text-sm text-orange-700">Available</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shift Details Summary */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5 text-orange-500" />
                      Shift Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm text-gray-500">Date & Time</div>
                            <div className="font-medium">{formatDate(newShift.date)}</div>
                            <div className="text-sm text-gray-600">
                              {formatTime(newShift.startTime)} - {formatTime(newShift.endTime)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium">{newShift.location}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm text-gray-500">Role & Staff</div>
                            <div className="font-medium">{newShift.staffType}</div>
                            <div className="text-sm text-gray-600">{newShift.staffNeeded} staff needed</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm text-gray-500">Budget</div>
                            <div className="font-medium">${newShift.hourlyRate}/hour</div>
                            <div className="text-sm text-gray-600">Total: ${fees.total.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selection Mode Toggle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setStaffSelectionMode('auto')}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      staffSelectionMode === 'auto' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        staffSelectionMode === 'auto' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                      }`}>
                        {staffSelectionMode === 'auto' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <h4 className="font-semibold text-gray-900">Auto-Match Staff</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      We'll automatically select the best available staff based on your requirements, ratings, and proximity.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600 font-medium">✓ Fastest option</span>
                      <span className="text-blue-600 font-medium">✓ AI-optimized matching</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setStaffSelectionMode('manual')}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      staffSelectionMode === 'manual' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        staffSelectionMode === 'manual' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                      }`}>
                        {staffSelectionMode === 'manual' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <h4 className="font-semibold text-gray-900">Browse & Choose</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse detailed profiles and hand-pick staff members based on their experience and your preferences.
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-blue-600 font-medium">✓ Full control</span>
                      <span className="text-purple-600 font-medium">✓ View profiles & reviews</span>
                    </div>
                  </button>
                </div>

                {/* Auto-Selection Results */}
                {staffSelectionMode === 'auto' && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h4 className="font-semibold text-green-900 mb-2">Smart Match Results</h4>
                        <p className="text-sm text-green-700 mb-4">
                          We found {filteredStaff.length} qualified staff members matching your criteria. 
                          We'll select the top {newShift.staffNeeded} based on ratings, experience, and proximity.
                        </p>
                        <Button 
                          onClick={handleAutoSelectStaff}
                          className="bg-green-600 hover:bg-green-700 text-white mb-4"
                          disabled={filteredStaff.length === 0}
                        >
                          Auto-Select {newShift.staffNeeded} Staff Member{parseInt(newShift.staffNeeded) > 1 ? 's' : ''}
                        </Button>
                        
                        {selectedWorkers.length > 0 && (
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-3">
                              Selected {selectedWorkers.length} staff member{selectedWorkers.length > 1 ? 's' : ''}:
                            </p>
                            <div className="space-y-3">
                              {selectedWorkers.map(workerId => {
                                const worker = MOCK_AVAILABLE_STAFF.find(s => s.id === workerId)
                                if (!worker) return null
                                return (
                                  <div key={workerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-orange-600">{worker.avatar}</span>
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900">{worker.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                          <span>{worker.rating}</span>
                                          <span>•</span>
                                          <span>{worker.distance}</span>
                                          <span>•</span>
                                          <span>${worker.hourlyRate}/hr</span>
                                        </div>
                                      </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      Matched
                                    </Badge>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Manual Selection Interface */}
                {staffSelectionMode === 'manual' && (
                  <div className="space-y-6">
                    {/* Filters */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Filter className="w-5 h-5 text-orange-500" />
                          Filter & Sort
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Min Rating</Label>
                            <Select 
                              value={staffFilters.minRating.toString()} 
                              onValueChange={(value) => setStaffFilters(prev => ({ ...prev, minRating: parseFloat(value) }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Any Rating</SelectItem>
                                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                <SelectItem value="4.8">4.8+ Stars</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Max Distance</Label>
                            <Select 
                              value={staffFilters.maxDistance.toString()} 
                              onValueChange={(value) => setStaffFilters(prev => ({ ...prev, maxDistance: parseFloat(value) }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">Within 5 miles</SelectItem>
                                <SelectItem value="10">Within 10 miles</SelectItem>
                                <SelectItem value="25">Within 25 miles</SelectItem>
                                <SelectItem value="50">Within 50 miles</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Max Rate</Label>
                            <Input
                              type="number"
                              value={staffFilters.maxRate}
                              onChange={(e) => setStaffFilters(prev => ({ ...prev, maxRate: parseInt(e.target.value) || 100 }))}
                              placeholder="$25"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select 
                              value={staffFilters.sortBy} 
                              onValueChange={(value: any) => setStaffFilters(prev => ({ ...prev, sortBy: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="distance">Closest</SelectItem>
                                <SelectItem value="rate">Lowest Rate</SelectItem>
                                <SelectItem value="experience">Most Experience</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Staff List Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Available Staff ({filteredStaff.length} found)</h4>
                        <p className="text-sm text-gray-600">Matching your requirements for {newShift.staffType}</p>
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {selectedWorkers.length}/{newShift.staffNeeded} selected
                      </div>
                    </div>

                    {/* Staff Cards */}
                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {filteredStaff.map(staff => (
                        <Card 
                          key={staff.id} 
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedWorkers.includes(staff.id) 
                              ? 'border-orange-500 bg-orange-50 shadow-md' 
                              : 'hover:border-gray-300'
                          }`}
                          onClick={() => handleManualStaffToggle(staff.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                  <span className="text-lg font-medium text-orange-600">{staff.avatar}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-semibold text-gray-900">{staff.name}</h5>
                                    {staff.verifications.includes("Background Check") && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span className="font-medium">{staff.rating}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{staff.experience}</span>
                                    <span>•</span>
                                    <span>{staff.distance}</span>
                                    <span>•</span>
                                    <span>{staff.completedShifts} shifts</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{staff.bio}</p>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {staff.skills.slice(0, 4).map(skill => (
                                      <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {staff.skills.length > 4 && (
                                      <Badge variant="outline" className="text-xs text-gray-500">
                                        +{staff.skills.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">{staff.responseTime}</div>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-3">
                                <div>
                                  <div className="text-xl font-bold text-gray-900">${staff.hourlyRate}/hr</div>
                                  <div className="text-sm text-gray-500">within budget</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Phone className="w-3 h-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Mail className="w-3 h-3" />
                                  </Button>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedWorkers.includes(staff.id)
                                      ? 'bg-orange-500 border-orange-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {selectedWorkers.includes(staff.id) && (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredStaff.length === 0 && (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <h4 className="font-medium text-gray-900 mb-2">No staff available</h4>
                          <p className="text-sm text-gray-500 max-w-md mx-auto">
                            No workers match your current criteria. Try adjusting your filters, increasing your hourly rate, or removing some requirements.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setStaffFilters({
                              minRating: 0,
                              maxDistance: 50,
                              maxRate: 100,
                              skills: [],
                              verifications: [],
                              sortBy: 'rating'
                            })}
                          >
                            Reset Filters
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Selection Summary */}
                {selectedWorkers.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-blue-900 mb-1">
                            {selectedWorkers.length} staff member{selectedWorkers.length > 1 ? 's' : ''} selected
                          </h5>
                          <p className="text-sm text-blue-700">
                            {selectedWorkers.length === parseInt(newShift.staffNeeded) 
                              ? 'Perfect! You have enough staff for this shift.' 
                              : `You need ${parseInt(newShift.staffNeeded) - selectedWorkers.length} more staff member${parseInt(newShift.staffNeeded) - selectedWorkers.length > 1 ? 's' : ''}.`
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWorkers([])}
                            className="text-blue-700 border-blue-300 hover:bg-blue-100"
                          >
                            Clear All
                          </Button>
                          <Badge className={`${
                            selectedWorkers.length === parseInt(newShift.staffNeeded) 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-orange-100 text-orange-800 border-orange-200'
                          }`}>
                            {selectedWorkers.length}/{newShift.staffNeeded}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                {currentPhase !== 'basic' && (
                  <Button 
                    variant="outline"
                    onClick={() => navigatePhase('back')}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {currentPhase === 'staff' && (
                  <Button 
                    variant="outline" 
                    onClick={handleCreateShift}
                    className="text-gray-600"
                  >
                    Skip & Hire Later
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                
                {currentPhase === 'staff' ? (
                  <Button 
                    onClick={() => setCurrentPhase('payment')}
                    disabled={selectedWorkers.length === 0}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    Continue with {selectedWorkers.length} Staff
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : currentPhase === 'schedule' ? (
                  <Button 
                    onClick={() => navigatePhase('next')}
                    disabled={!canNavigateNext()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    Find Staff
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigatePhase('next')}
                    disabled={!canNavigateNext()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}