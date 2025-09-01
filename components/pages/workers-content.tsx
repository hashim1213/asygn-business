"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WorkerSearch } from "@/components/workers/worker-search"
import { WorkerCard } from "@/components/workers/worker-card"
import { WorkerFilters } from "@/components/workers/worker-filters"
import { availableWorkers } from "@/lib/data/mock-data"
import { Users, CheckCircle, Star, Clock, TrendingUp, Zap, MapPin, Calendar, DollarSign, AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ShiftDetails {
  id?: string
  title: string
  location: string
  date: string
  startTime: string
  endTime: string
  hourlyRate: number
  staffNeeded: number
  staffType: string
  dressAttire: string
  description: string
  specialRequirements: string[]
  workerType: "regular" | "pro"
}

interface WorkersContentProps {
  shiftDetails?: ShiftDetails
  isHiringMode?: boolean
  onBack?: () => void
  onWorkerHired?: (workerId: string) => void
}

export function WorkersContent({ 
  shiftDetails, 
  isHiringMode = false, 
  onBack,
  onWorkerHired 
}: WorkersContentProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("matched")
  const [searchRadius, setSearchRadius] = useState(shiftDetails ? "10" : "25")
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [filters, setFilters] = useState({
    availability: [],
    skills: shiftDetails?.staffType ? [shiftDetails.staffType] : [],
    maxDistance: parseInt(searchRadius),
    minRating: shiftDetails?.workerType === "pro" ? 4.5 : 0,
    maxHourlyRate: shiftDetails?.hourlyRate || 50,
  })

  // Update filters when shift details change or radius changes
  useEffect(() => {
    if (shiftDetails) {
      setFilters(prev => ({
        ...prev,
        skills: [shiftDetails.staffType],
        maxHourlyRate: shiftDetails.hourlyRate,
        maxDistance: parseInt(searchRadius),
        minRating: shiftDetails.workerType === "pro" ? 4.5 : 0,
      }))
    }
  }, [shiftDetails, searchRadius])

  const handleMessage = (workerId: string) => {
    console.log("Message worker:", workerId)
    // Open messaging interface
  }

  const handleHire = (workerId: string) => {
    if (isHiringMode && shiftDetails) {
      setSelectedWorkers(prev => {
        const newSelected = prev.includes(workerId) 
          ? prev.filter(id => id !== workerId)
          : [...prev, workerId]
        
        // If we've selected enough workers, proceed to payment
        if (newSelected.length === shiftDetails.staffNeeded && !prev.includes(workerId)) {
          handleProceedToHire(newSelected)
        }
        
        return newSelected
      })
    } else {
      console.log("Hire worker:", workerId)
      // Regular hiring flow
    }
  }

  const handleProceedToHire = (workerIds: string[]) => {
    console.log("Proceeding to hire workers:", workerIds)
    // Here you would typically:
    // 1. Create payment hold
    // 2. Send hire requests to workers
    // 3. Navigate to confirmation/payment page
    if (onWorkerHired) {
      workerIds.forEach(workerId => onWorkerHired(workerId))
    }
  }

  const handleInviteWorker = () => {
    console.log("Invite new worker")
  }

  // Enhanced filtering logic with shift matching
  const filteredWorkers = availableWorkers.filter((worker) => {
    const matchesSearch =
      searchQuery === "" ||
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAvailability =
      filters.availability.length === 0 ||
      (filters.availability.includes("Available Now") && worker.available) ||
      filters.availability.includes("Available Today") ||
      filters.availability.includes("Available This Week")

    const matchesSkills = 
      filters.skills.length === 0 || 
      filters.skills.some((skill) => worker.skills.includes(skill))

    const matchesDistance = parseFloat(worker.distance) <= filters.maxDistance
    const matchesRating = worker.rating >= filters.minRating
    const matchesRate = worker.hourlyRate <= filters.maxHourlyRate

    // Shift-specific matching
    const matchesShiftType = !shiftDetails || 
      worker.skills.includes(shiftDetails.staffType) ||
      worker.skills.some(skill => skill.toLowerCase().includes(shiftDetails.staffType.toLowerCase()))

    const matchesShiftRequirements = !shiftDetails?.specialRequirements?.length ||
      shiftDetails.specialRequirements.every(req => 
        worker.certifications?.includes(req) || 
        worker.skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
      )

    // Tab filtering
    let matchesTab = false
    switch (activeTab) {
      case "all":
        matchesTab = true
        break
      case "matched":
        matchesTab = !shiftDetails || (matchesShiftType && matchesShiftRequirements && worker.hourlyRate <= (shiftDetails.hourlyRate * 1.1))
        break
      case "available":
        matchesTab = worker.available
        break
      case "instant":
        matchesTab = worker.available && worker.responseTime === "instantly"
        break
      case "top-rated":
        matchesTab = worker.rating >= 4.8
        break
      case "nearby":
        matchesTab = parseFloat(worker.distance) <= 3.0
        break
    }

    return matchesSearch && matchesAvailability && matchesSkills && matchesDistance && matchesRating && matchesRate && matchesShiftType && matchesShiftRequirements && matchesTab
  })

  // Sort workers by relevance when in hiring mode
  const sortedWorkers = isHiringMode && shiftDetails
    ? filteredWorkers.sort((a, b) => {
        // Perfect skill match
        const aSkillMatch = a.skills.includes(shiftDetails.staffType) ? 2 : a.skills.some(s => s.toLowerCase().includes(shiftDetails.staffType.toLowerCase())) ? 1 : 0
        const bSkillMatch = b.skills.includes(shiftDetails.staffType) ? 2 : b.skills.some(s => s.toLowerCase().includes(shiftDetails.staffType.toLowerCase())) ? 1 : 0
        
        if (aSkillMatch !== bSkillMatch) return bSkillMatch - aSkillMatch
        
        // Available now
        if (a.available !== b.available) return a.available ? -1 : 1
        
        // Rating
        if (a.rating !== b.rating) return b.rating - a.rating
        
        // Distance
        return parseFloat(a.distance) - parseFloat(b.distance)
      })
    : filteredWorkers

  // Calculate stats
  const availableNow = availableWorkers.filter(w => w.available).length
  const averageRating = availableWorkers.reduce((acc, w) => acc + w.rating, 0) / availableWorkers.length
  const instantWorkers = availableWorkers.filter(w => w.available && w.responseTime === "instantly").length
  const matchedWorkers = shiftDetails ? availableWorkers.filter(w => 
    w.skills.includes(shiftDetails.staffType) || 
    w.skills.some(skill => skill.toLowerCase().includes(shiftDetails.staffType.toLowerCase()))
  ).length : 0

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hiring Mode Header */}
      {isHiringMode && shiftDetails && (
        <Card className="bg-orange-50 border border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="outline" size="sm" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Find Staff for "{shiftDetails.title}"</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {shiftDetails.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(shiftDetails.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(shiftDetails.startTime)} - {formatTime(shiftDetails.endTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Up to ${shiftDetails.hourlyRate}/hr
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Hiring Progress</div>
                <div className="text-xl font-bold text-orange-600">
                  {selectedWorkers.length}/{shiftDetails.staffNeeded} selected
                </div>
                {selectedWorkers.length > 0 && (
                  <Button 
                    size="sm" 
                    className="mt-2 bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleProceedToHire(selectedWorkers)}
                  >
                    Proceed to Hire ({selectedWorkers.length})
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search Radius Adjustment */}
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Search Radius:</label>
              <div className="flex gap-2">
                {["5", "10", "25", "50"].map((radius) => (
                  <Button
                    key={radius}
                    variant={searchRadius === radius ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchRadius(radius)}
                    className={searchRadius === radius ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {radius} miles
                  </Button>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({filteredWorkers.length} workers found)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Search Header */}
      {!isHiringMode && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Staff</h2>
              <p className="text-gray-600">Hire qualified workers in minutes, just like ordering a ride</p>
            </div>
            <WorkerSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterClick={() => setShowFilters(true)}
              onInviteWorker={handleInviteWorker}
            />
          </CardContent>
        </Card>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isHiringMode && shiftDetails ? (
          // Hiring mode stats
          <>
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Matched Workers</p>
                    <p className="text-2xl font-bold text-gray-900">{matchedWorkers}</p>
                    <p className="text-xs text-orange-600 mt-1">Perfect skill match</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Now</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredWorkers.filter(w => w.available).length}</p>
                    <p className="text-xs text-green-600 mt-1">Can start today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Within Radius</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredWorkers.length}</p>
                    <p className="text-xs text-blue-600 mt-1">{searchRadius} mile radius</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Selected</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedWorkers.length}</p>
                    <p className="text-xs text-purple-600 mt-1">of {shiftDetails.staffNeeded} needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Regular mode stats
          <>
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Workers</p>
                    <p className="text-2xl font-bold text-gray-900">{availableWorkers.length}</p>
                    <p className="text-xs text-blue-600 mt-1">In your area</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Now</p>
                    <p className="text-2xl font-bold text-gray-900">{availableNow}</p>
                    <p className="text-xs text-green-600 mt-1">Ready to work</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                    <p className="text-xs text-yellow-600 mt-1">Highly rated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Instant Hire</p>
                    <p className="text-2xl font-bold text-gray-900">{instantWorkers}</p>
                    <p className="text-xs text-purple-600 mt-1">Start immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border">
          {[
            ...(isHiringMode && shiftDetails ? [
              { key: "matched", label: "Best Matches", icon: Star }
            ] : []),
            { key: "all", label: "All Workers", icon: Users },
            { key: "available", label: "Available", icon: CheckCircle },
            { key: "instant", label: "Instant Hire", icon: Zap },
            { key: "top-rated", label: "Top Rated", icon: Star },
            { key: "nearby", label: "Nearby", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon
            let count = 0
            
            switch (tab.key) {
              case "matched":
                count = matchedWorkers
                break
              case "all":
                count = availableWorkers.length
                break
              case "available":
                count = availableNow
                break
              case "instant":
                count = instantWorkers
                break
              case "top-rated":
                count = availableWorkers.filter(w => w.rating >= 4.8).length
                break
              case "nearby":
                count = availableWorkers.filter(w => parseFloat(w.distance) <= 3.0).length
                break
            }

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
                  {count}
                </Badge>
              </button>
            )
          })}
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {sortedWorkers.length} of {availableWorkers.length} workers
          </p>
          <p className="text-xs text-gray-400">
            {sortedWorkers.filter(w => w.available).length} available now
          </p>
        </div>
      </div>

      {/* Workers Grid */}
      {sortedWorkers.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No workers found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isHiringMode && shiftDetails 
                ? `No workers match your shift requirements in the ${searchRadius} mile radius. Try expanding your search radius or adjusting requirements.`
                : searchQuery 
                  ? `No workers match "${searchQuery}". Try different keywords or adjust your filters.`
                  : "No workers match your current filters. Try expanding your search criteria."
              }
            </p>
            <div className="flex gap-3 justify-center">
              {isHiringMode ? (
                <Button 
                  variant="outline"
                  onClick={() => setSearchRadius("50")}
                >
                  Expand to 50 miles
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("all")
                    setFilters({
                      availability: [],
                      skills: [],
                      maxDistance: 50,
                      minRating: 0,
                      maxHourlyRate: 50,
                    })
                  }}
                >
                  Clear all filters
                </Button>
              )}
              <Button onClick={handleInviteWorker} className="bg-orange-500 hover:bg-orange-600 text-white">
                Invite Worker
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedWorkers.map((worker) => (
            <WorkerCard 
              key={worker.id} 
              worker={worker} 
              onMessage={handleMessage} 
              onHire={handleHire}
              isHiringMode={isHiringMode}
              isSelected={selectedWorkers.includes(worker.id)}
              shiftDetails={shiftDetails}
            />
          ))}
        </div>
      )}

      {/* Hiring Progress Summary */}
      {isHiringMode && selectedWorkers.length > 0 && (
        <Card className="bg-green-50 border border-green-200 sticky bottom-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">
                  {selectedWorkers.length}/{shiftDetails?.staffNeeded} Workers Selected
                </h3>
                <p className="text-sm text-green-700">
                  Ready to proceed with hiring for "{shiftDetails?.title}"
                </p>
              </div>
              <Button 
                onClick={() => handleProceedToHire(selectedWorkers)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Modal */}
      <WorkerFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        shiftDetails={shiftDetails}
      />
    </div>
  )
}