"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Phone, Mail, Star, MapPin, Calendar, Clock, DollarSign, Users, FileText, AlertCircle, X, Maximize2, Minimize2 } from "lucide-react"
import { Shift, mockStaff } from "@/components/shifts/data/mockData"

interface ShiftDetailsSheetProps {
  shift: Shift | null
  isOpen: boolean
  onClose: () => void
}

export function ShiftDetailsSheet({ shift, isOpen, onClose }: ShiftDetailsSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setIsExpanded(false)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleExpand = () => {
    setIsAnimating(true)
    setIsExpanded(!isExpanded)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-50 text-red-700 border border-red-200"
      case "filled":
        return "bg-green-50 text-green-700 border border-green-200"
      case "open":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200"
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

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01 ${startTime}`)
    let end = new Date(`2000-01-01 ${endTime}`)
    
    if (end < start) {
      end = new Date(`2000-01-02 ${endTime}`)
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }

  const getAssignedStaff = (staffIds: number[]) => {
    return staffIds.map(id => mockStaff.find(staff => staff.id === id)).filter((staff): staff is NonNullable<typeof staff> => staff !== undefined)
  }

  if (!isOpen || !shift) return null

  const assignedStaff = getAssignedStaff(shift.staffAssigned)
  const shiftHours = calculateHours(shift.startTime, shift.endTime)
  const totalPay = shift.hourlyRate * shiftHours

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out ${
          isExpanded 
            ? 'top-0 rounded-t-none' 
            : 'top-[40vh]'
        } ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
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
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{shift.title}</h2>
                <Badge className={`${getStatusColor(shift.status)} font-medium px-3 py-1`}>
                  {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                </Badge>
              </div>
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
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Date info */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(shift.date)}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto ${isExpanded ? 'h-full pb-6' : 'max-h-[60vh]'}`}>
          <div className="p-6 space-y-8">
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-900">{shiftHours}h</div>
                  <div className="text-sm text-blue-700">Duration</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-900">${shift.hourlyRate}</div>
                  <div className="text-sm text-green-700">Per Hour</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-purple-900">{shift.staffAssigned.length}/{shift.staffNeeded}</div>
                  <div className="text-sm text-purple-700">Staffed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-orange-900">${totalPay.toFixed(0)}</div>
                  <div className="text-sm text-orange-700">Total Pay</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Shift Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5 text-orange-500" />
                      Shift Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Location & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium text-gray-900">{shift.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="font-medium text-gray-900">{formatDate(shift.date)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-500">Time</div>
                            <div className="font-medium text-gray-900">
                              {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-500">Hourly Rate</div>
                            <div className="font-medium text-gray-900">${shift.hourlyRate}/hour</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Job Description</h4>
                      <p className="text-gray-700 leading-relaxed">{shift.description}</p>
                    </div>

                    <Separator />

                    {/* Requirements */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {shift.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Payment Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Rate ({shiftHours} hours × ${shift.hourlyRate})</span>
                        <span className="font-medium">${totalPay.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Service Fee (15%)</span>
                        <span className="font-medium">${(totalPay * 0.15).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trust & Safety (8%)</span>
                        <span className="font-medium">${(totalPay * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaction Fee (2%)</span>
                        <span className="font-medium">${(totalPay * 0.02).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Cost</span>
                        <span className="text-orange-600">${(totalPay * 1.25).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Staff Assignment */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-500" />
                        Staff Assignment
                      </div>
                      {shift.status === "urgent" && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Urgent
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Staffing Progress</span>
                        <span className="text-sm font-medium">
                          {shift.staffAssigned.length} of {shift.staffNeeded} filled
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            shift.staffAssigned.length === shift.staffNeeded ? 'bg-green-500' :
                            shift.staffAssigned.length > 0 ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                          style={{ width: `${Math.max((shift.staffAssigned.length / shift.staffNeeded) * 100, 8)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((shift.staffAssigned.length / shift.staffNeeded) * 100)}% complete
                      </div>
                    </div>

                    {/* Assigned Staff */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Assigned Staff</h4>
                      {assignedStaff.length > 0 ? (
                        <div className="space-y-3">
                          {assignedStaff.map((staff) => (
                            <div key={staff.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-orange-600">{staff.avatar}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{staff.name}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span>{staff.rating}</span>
                                      <span>•</span>
                                      <span>{staff.experience}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {staff.completedShifts} completed shifts
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No staff assigned yet</p>
                        </div>
                      )}

                      {/* Find Staff Button */}
                      {shift.staffAssigned.length < shift.staffNeeded && (
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Find Staff ({shift.staffNeeded - shift.staffAssigned.length} needed)
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Shift Details
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Staff
                      </Button>
                      {shift.status === "urgent" && (
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Urgent Hire
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Action Bar - Only show when not expanded */}
            {!isExpanded && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Edit Shift
                  </Button>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Staff
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}