"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapPin, X, Search, CheckCircle, ChevronDown, ChevronRight, ChevronLeft, CreditCard, ArrowLeft } from "lucide-react"
import { WorkersContent } from "@/components/pages/workers-content"

// Types
interface CreateShiftModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

type Phase = 'basic' | 'requirements' | 'schedule' | 'success' | 'hire' | 'payment'

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

export function CreateShiftModal({ open, onOpenChange }: CreateShiftModalProps) {
  // State
  const [currentPhase, setCurrentPhase] = useState<Phase>('basic')
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [newShift, setNewShift] = useState<ShiftDetails>(INITIAL_SHIFT_STATE)
  const [staffTypeSearch, setStaffTypeSearch] = useState("")

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

  const getShiftDetailsForWorkers = () => {
    if (!newShift.title) return undefined
    
    return {
      title: newShift.title,
      location: newShift.location,
      date: newShift.date,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      hourlyRate: parseFloat(newShift.hourlyRate) || 0,
      staffNeeded: parseInt(newShift.staffNeeded) || 1,
      staffType: newShift.staffType,
      dressAttire: newShift.dressAttire,
      description: newShift.description,
      specialRequirements: newShift.specialRequirements,
      workerType: newShift.workerType
    }
  }

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'basic': return 'Basic Information'
      case 'requirements': return 'Requirements'
      case 'schedule': return 'Schedule & Pricing'
      case 'hire': return 'Find Staff'
      case 'payment': return 'Confirm & Pay'
      default: return 'Create Shift'
    }
  }

  // Event Handlers
  const handleCreateShift = () => {
    console.log("Creating shift:", newShift)
    setCurrentPhase('success')
  }

  const handleHireNow = () => {
    setCurrentPhase('hire')
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
  }

  const navigatePhase = (direction: 'next' | 'back') => {
    const phases: Phase[] = ['basic', 'requirements', 'schedule']
    const currentIndex = phases.indexOf(currentPhase as any)
    
    if (direction === 'next' && currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1])
    } else if (direction === 'back' && currentIndex > 0) {
      setCurrentPhase(phases[currentIndex - 1])
    }
  }

  // Computed Values
  const timeOptions = generateTimeOptions()
  const fees = calculateFees()
  const filteredStaffTypes = STAFF_TYPES.filter(type => 
    type.toLowerCase().includes(staffTypeSearch.toLowerCase())
  )

  // Render Special Phases
  if (currentPhase === 'success') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Shift Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your shift "{newShift.title}" has been created and is ready for staff assignment.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleHireNow}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Find Staff Now
              </Button>
              <Button variant="outline" onClick={handleRequestLater}>
                Find Staff Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (currentPhase === 'hire') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
          <WorkersContent
            shiftDetails={getShiftDetailsForWorkers()}
            isHiringMode={true}
            onBack={() => setCurrentPhase('success')}
            onWorkerHired={handleWorkerHired}
          />
        </DialogContent>
      </Dialog>
    )
  }

  if (currentPhase === 'payment') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPhase('hire')}
                className="p-1 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              Confirm & Pay
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
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
                      {new Date(newShift.date).toLocaleDateString()} • {calculateShiftHours().toFixed(1)}h
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

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentPhase('hire')}>
              Back to Staff Selection
            </Button>
            <Button onClick={handlePaymentComplete} className="bg-orange-500 hover:bg-orange-600 flex-1">
              Confirm & Pay ${fees.total.toFixed(2)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Main Form Phases
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          open ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => onOpenChange(false)}
      />
      
      <div 
        className={`fixed inset-0 z-50 bg-white transition-all duration-300 ease-out overflow-hidden ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold text-gray-900">
                Create New Shift - {getPhaseTitle()}
              </h2>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {['basic', 'requirements', 'schedule'].map((phase, index) => (
              <div key={phase} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentPhase === phase 
                    ? 'bg-orange-500 text-white' 
                    : index < ['basic', 'requirements', 'schedule'].indexOf(currentPhase)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < ['basic', 'requirements', 'schedule'].indexOf(currentPhase)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6">
            <div className="space-y-6">
              {/* Basic Information Phase */}
              {currentPhase === 'basic' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Shift Title</Label>
                    <Input
                      id="title"
                      value={newShift.title}
                      onChange={(e) => setNewShift(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Evening Server - Fine Dining"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
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
                    <Label>Staff Type</Label>
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
              )}

              {/* Requirements Phase */}
              {currentPhase === 'requirements' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Dress Attire</Label>
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
              )}

              {/* Schedule & Pricing Phase */}
              {currentPhase === 'schedule' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newShift.date}
                        onChange={(e) => setNewShift(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
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
                      <Label>End Time</Label>
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
                        {newShift.workerType === "pro" ? "Budget Range" : "Hourly Rate"}
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
                      />
                      {newShift.workerType === "pro" && (
                        <p className="text-xs text-orange-600">
                          Pros set their own rates within your budget
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staffNeeded">Staff Needed</Label>
                      <Input
                        id="staffNeeded"
                        type="number"
                        min="1"
                        max="20"
                        value={newShift.staffNeeded}
                        onChange={(e) => setNewShift(prev => ({ ...prev, staffNeeded: e.target.value }))}
                        placeholder="1"
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
                      
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between">
              <div>
                {currentPhase !== 'basic' && (
                  <Button 
                    variant="outline"
                    onClick={() => navigatePhase('back')}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                
                {currentPhase === 'schedule' ? (
                  <Button 
                    onClick={handleCreateShift}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Create Shift
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigatePhase('next')}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
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