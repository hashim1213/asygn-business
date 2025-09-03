"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Calendar, List } from "lucide-react"
import { ShiftsAnalytics } from "@/components/shifts/ShiftsAnalytics"
import { CreateShiftModal } from "@/components/shifts/CreateShiftModal"
import { ShiftsListView } from "@/components/shifts/ShiftsListView"
import { ShiftsCalendarView } from "@/components/shifts/ShiftsCalendarView"
import { ShiftDetailsSheet } from "@/components/shifts/ShiftDetailsModal"
import { mockShifts } from "@/components/shifts/data/mockData"
import { Shift } from "@/components/shifts/data/mockData"

export function ShiftsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [hireShift, setHireShift] = useState<Shift | null>(null)

  const filteredShifts = mockShifts.filter((shift) => {
    const matchesSearch = shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTab = activeTab === "all" || shift.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleHireStaff = (shift: Shift) => {
    // Convert shift to the format expected by the modal
    const shiftForHiring = {
      title: shift.title,
      location: shift.location,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      hourlyRate: shift.hourlyRate.toString(),
      staffNeeded: shift.staffNeeded.toString(),
      staffType: shift.requirements.find(req => 
        ['Server', 'Bartender', 'Host/Hostess', 'Cook', 'Kitchen Assistant', 'Dishwasher', 'Barista', 'Cashier'].includes(req)
      ) || 'Server',
      description: shift.description || '',
      specialRequirements: shift.requirements.filter(req => 
        !['Server', 'Bartender', 'Host/Hostess', 'Cook', 'Kitchen Assistant', 'Dishwasher', 'Barista', 'Cashier'].includes(req)
      ),
      dressAttire: shift.requirements.find(req => 
        ['Business Casual', 'Uniform Provided', 'All Black', 'Chef Whites'].includes(req)
      ) || 'Business Casual',
      workerType: 'regular' as const,
      useCurrentLocation: false
    }
    
    setHireShift(shift)
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = (open: boolean) => {
    if (!open) {
      setHireShift(null)
    }
    setShowCreateModal(open)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search shifts by title, location, or requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            className="flex items-center gap-2"
          >
            {viewMode === "list" ? <Calendar className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {viewMode === "list" ? "Calendar" : "List"} View
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Shift
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <ShiftsAnalytics shifts={mockShifts} />

      {/* Filter Tabs */}
      {viewMode === "list" && (
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border">
            {[
              { key: "all", label: "All Shifts", count: mockShifts.length },
              { key: "urgent", label: "Urgent", count: mockShifts.filter(s => s.status === 'urgent').length },
              { key: "open", label: "Open", count: mockShifts.filter(s => s.status === 'open').length },
              { key: "filled", label: "Filled", count: mockShifts.filter(s => s.status === 'filled').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <Badge variant="secondary" className={`text-xs ${
                  activeTab === tab.key ? "bg-orange-400 text-white" : "bg-gray-200"
                }`}>
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-500">
            {filteredShifts.length} of {mockShifts.length} shifts
          </p>
        </div>
      )}

      {/* Views */}
      {viewMode === "calendar" ? (
        <ShiftsCalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          filteredShifts={filteredShifts}
          onShiftClick={setSelectedShift}
        />
      ) : (
        <ShiftsListView
          filteredShifts={filteredShifts}
          onViewDetails={setSelectedShift}
          onHireStaff={handleHireStaff}
        />
      )}

      {/* Modals */}
      <CreateShiftModal
        open={showCreateModal}
        onOpenChange={handleCloseCreateModal}
        initialShift={hireShift ? {
          title: hireShift.title,
          location: hireShift.location,
          date: hireShift.date,
          startTime: hireShift.startTime,
          endTime: hireShift.endTime,
          hourlyRate: hireShift.hourlyRate.toString(),
          staffNeeded: hireShift.staffNeeded.toString(),
          staffType: hireShift.requirements.find(req => 
            ['Server', 'Bartender', 'Host/Hostess', 'Cook', 'Kitchen Assistant', 'Dishwasher', 'Barista', 'Cashier'].includes(req)
          ) || 'Server',
          description: hireShift.description || '',
          specialRequirements: hireShift.requirements.filter(req => 
            !['Server', 'Bartender', 'Host/Hostess', 'Cook', 'Kitchen Assistant', 'Dishwasher', 'Barista', 'Cashier'].includes(req)
          ),
          dressAttire: hireShift.requirements.find(req => 
            ['Business Casual', 'Uniform Provided', 'All Black', 'Chef Whites'].includes(req)
          ) || 'Business Casual',
          workerType: 'regular' as const,
          useCurrentLocation: false
        } : undefined}
        startFromStaff={!!hireShift}
      />

      <ShiftDetailsSheet
        shift={selectedShift}
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
      />
    </div>
  )
}