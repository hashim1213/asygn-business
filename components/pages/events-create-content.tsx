"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Save
} from "lucide-react"
import Link from "next/link"

const eventTypes = [
  "Wedding", "Corporate Event", "Music Festival", "Food Festival", "Conference", 
  "Gala", "Birthday Party", "Graduation", "Networking Event", "Product Launch",
  "Trade Show", "Concert", "Sporting Event", "Charity Event", "Holiday Party"
]

const commonRoles = [
  "Server", "Bartender", "Host/Hostess", "Cook", "Kitchen Assistant", 
  "Dishwasher", "Barista", "Cashier", "Event Coordinator", "Security",
  "Photographer", "DJ", "Sound Tech", "Lighting Tech", "Stage Crew"
]

export function CreateEventContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    eventType: "",
    description: "",
    location: "",
    eventDate: "",
    eventEndDate: "",
    expectedGuests: "",
    totalBudget: "",
    estimatedPositions: "",
    commonRoles: [] as string[],
    specialRequirements: [] as string[],
    notes: ""
  })
  
  const [customRole, setCustomRole] = useState("")
  const [customRequirement, setCustomRequirement] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const addCustomRole = () => {
    if (customRole.trim() && !formData.commonRoles.includes(customRole.trim())) {
      updateFormData("commonRoles", [...formData.commonRoles, customRole.trim()])
      setCustomRole("")
    }
  }

  const removeRole = (roleToRemove: string) => {
    updateFormData("commonRoles", formData.commonRoles.filter(role => role !== roleToRemove))
  }

  const addCustomRequirement = () => {
    if (customRequirement.trim() && !formData.specialRequirements.includes(customRequirement.trim())) {
      updateFormData("specialRequirements", [...formData.specialRequirements, customRequirement.trim()])
      setCustomRequirement("")
    }
  }

  const removeRequirement = (reqToRemove: string) => {
    updateFormData("specialRequirements", formData.specialRequirements.filter(req => req !== reqToRemove))
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Event title is required"
      if (!formData.eventType) newErrors.eventType = "Event type is required"
      if (!formData.eventDate) newErrors.eventDate = "Event date is required"
      if (!formData.location.trim()) newErrors.location = "Location is required"
    }
    
    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = "Event description is required"
      if (!formData.expectedGuests) newErrors.expectedGuests = "Expected number of guests is required"
      if (!formData.estimatedPositions) newErrors.estimatedPositions = "Estimated staff positions is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (validateStep(2)) {
      try {
        // Here you would normally submit to your API
        console.log("Submitting event:", formData)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to events page or the new event's shifts page
        window.location.href = "/events"
      } catch (error) {
        console.error("Error creating event:", error)
      }
    }
  }

  const isStepComplete = (step: number) => {
    if (step === 1) {
      return formData.title && formData.eventType && formData.eventDate && formData.location
    }
    if (step === 2) {
      return formData.description && formData.expectedGuests && formData.estimatedPositions
    }
    return false
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/events" className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {isStepComplete(1) ? <CheckCircle className="w-4 h-4" /> : '1'}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">Event Details</span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep > 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {isStepComplete(2) ? <CheckCircle className="w-4 h-4" /> : '2'}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">Staff Planning</span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep > 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">Review</span>
        </div>
      </div>

      {/* Step 1: Event Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Wedding Reception"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Select value={formData.eventType} onValueChange={(value) => updateFormData("eventType", value)}>
                  <SelectTrigger className={errors.eventType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventType && <p className="text-sm text-red-600 mt-1">{errors.eventType}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="location"
                    placeholder="Venue name or address"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
              </div>

              <div>
                <Label htmlFor="eventDate">Event Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateFormData("eventDate", e.target.value)}
                    className={`pl-10 ${errors.eventDate ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.eventDate && <p className="text-sm text-red-600 mt-1">{errors.eventDate}</p>}
              </div>

              <div>
                <Label htmlFor="eventEndDate">Event End Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="eventEndDate"
                    type="date"
                    value={formData.eventEndDate}
                    onChange={(e) => updateFormData("eventEndDate", e.target.value)}
                    className="pl-10"
                    min={formData.eventDate}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Leave blank for single-day events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Staff Planning */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Event & Staffing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, the atmosphere, and any special requirements..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="expectedGuests">Expected Guests *</Label>
                  <Input
                    id="expectedGuests"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.expectedGuests}
                    onChange={(e) => updateFormData("expectedGuests", e.target.value)}
                    className={errors.expectedGuests ? "border-red-500" : ""}
                  />
                  {errors.expectedGuests && <p className="text-sm text-red-600 mt-1">{errors.expectedGuests}</p>}
                </div>

                <div>
                  <Label htmlFor="estimatedPositions">Est. Staff Needed *</Label>
                  <Input
                    id="estimatedPositions"
                    type="number"
                    placeholder="e.g., 12"
                    value={formData.estimatedPositions}
                    onChange={(e) => updateFormData("estimatedPositions", e.target.value)}
                    className={errors.estimatedPositions ? "border-red-500" : ""}
                  />
                  {errors.estimatedPositions && <p className="text-sm text-red-600 mt-1">{errors.estimatedPositions}</p>}
                </div>

                <div>
                  <Label htmlFor="totalBudget">Total Staff Budget (Optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="totalBudget"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.totalBudget}
                      onChange={(e) => updateFormData("totalBudget", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Roles Needed</CardTitle>
              <p className="text-sm text-gray-600">Select the types of staff you'll need for this event</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Common Roles</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {commonRoles.map((role) => (
                    <label key={role} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.commonRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData("commonRoles", [...formData.commonRoles, role])
                          } else {
                            removeRole(role)
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Add Custom Role</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="e.g., Event Photographer"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomRole()}
                  />
                  <Button type="button" onClick={addCustomRole} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {formData.commonRoles.length > 0 && (
                <div>
                  <Label>Selected Roles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.commonRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="flex items-center gap-1">
                        {role}
                        <button onClick={() => removeRole(role)} className="ml-1 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Requirements (Optional)</CardTitle>
              <p className="text-sm text-gray-600">Any special skills, certifications, or requirements</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Smart Serve Certification, Bilingual, Formal Experience"
                    value={customRequirement}
                    onChange={(e) => setCustomRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomRequirement()}
                  />
                  <Button type="button" onClick={addCustomRequirement} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {formData.specialRequirements.length > 0 && (
                <div>
                  <Label>Special Requirements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialRequirements.map((req) => (
                      <Badge key={req} variant="outline" className="flex items-center gap-1">
                        {req}
                        <button onClick={() => removeRequirement(req)} className="ml-1 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any additional information, special instructions, or notes for potential staff..."
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Review Your Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {formData.title}</p>
                  <p><span className="font-medium">Type:</span> {formData.eventType}</p>
                  <p><span className="font-medium">Location:</span> {formData.location}</p>
                  <p><span className="font-medium">Date:</span> {formData.eventDate} {formData.eventEndDate && `to ${formData.eventEndDate}`}</p>
                  <p><span className="font-medium">Expected Guests:</span> {formData.expectedGuests}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Staffing Plan</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Estimated Staff:</span> {formData.estimatedPositions}</p>
                  {formData.totalBudget && <p><span className="font-medium">Budget:</span> ${formData.totalBudget}</p>}
                  {formData.commonRoles.length > 0 && (
                    <div>
                      <span className="font-medium">Roles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.commonRoles.map((role) => (
                          <Badge key={role} variant="secondary" className="text-xs">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-700">{formData.description}</p>
            </div>

            {formData.specialRequirements.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Special Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.specialRequirements.map((req) => (
                    <Badge key={req} variant="outline" className="text-xs">{req}</Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                <p className="text-sm text-gray-700">{formData.notes}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4" />
                <span>After creating your event, you'll be able to create specific shifts and start hiring staff.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep < 3 ? (
            <Button 
              onClick={handleNext}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Create Event
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}