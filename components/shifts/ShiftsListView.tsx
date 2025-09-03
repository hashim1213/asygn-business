import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, User, Eye, Edit, Star, Users } from "lucide-react"
import { Shift, mockStaff } from "@/components/shifts/data/mockData"

interface ShiftsListViewProps {
  filteredShifts: Shift[]
  onViewDetails: (shift: Shift) => void
  onHireStaff?: (shift: Shift) => void
}

export function ShiftsListView({ filteredShifts, onViewDetails, onHireStaff }: ShiftsListViewProps) {
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
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getAssignedStaff = (staffIds: number[]) => {
    return staffIds.map(id => mockStaff.find(staff => staff.id === id)).filter((staff): staff is NonNullable<typeof staff> => staff !== undefined)
  }

  const convertShiftForHiring = (shift: Shift) => {
    return {
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
  }

  if (filteredShifts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {filteredShifts.map((shift) => {
        const assignedStaff = getAssignedStaff(shift.staffAssigned)
        const isFullyStaffed = shift.staffAssigned.length >= shift.staffNeeded
        const needsStaff = shift.staffAssigned.length < shift.staffNeeded
        
        return (
          <Card key={shift.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{shift.title}</h3>
                    <Badge className={`${getStatusColor(shift.status)} font-medium`}>
                      {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Shift Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">{formatDate(shift.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">${shift.hourlyRate}/hour</span>
                    </div>
                  </div>

                  {/* Assigned Staff Cards */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Assigned Staff ({shift.staffAssigned.length}/{shift.staffNeeded})
                      </h4>
                      <div className="text-xs text-gray-500">
                        {shift.staffNeeded - shift.staffAssigned.length} positions remaining
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {assignedStaff.map((staff) => (
                        <div key={staff.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 min-w-0">
                          <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-600">{staff.avatar}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{staff.name}</p>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500">{staff.rating}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{staff.completedShifts} shifts</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Empty slots */}
                      {Array.from({ length: shift.staffNeeded - shift.staffAssigned.length }).map((_, index) => (
                        <div key={`empty-${index}`} className="flex items-center justify-center bg-gray-100 rounded-lg p-3 border-2 border-dashed border-gray-300 min-w-32">
                          <div className="text-center">
                            <User className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Need staff</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {shift.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Staffing Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Staffing Progress</span>
                      <span>{Math.round((shift.staffAssigned.length / shift.staffNeeded) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          shift.staffAssigned.length === shift.staffNeeded ? 'bg-green-500' :
                          shift.staffAssigned.length > 0 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${Math.max((shift.staffAssigned.length / shift.staffNeeded) * 100, 8)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 ml-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-gray-50"
                    onClick={() => onViewDetails(shift)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-gray-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  
                  {/* Conditional Hire/Find Staff Button */}
                  {needsStaff && shift.status !== 'filled' && (
                    <>
                      {shift.status === "urgent" ? (
                        <Button 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => onHireStaff?.(shift)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Urgent Hire
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => onHireStaff?.(shift)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Find Staff
                        </Button>
                      )}
                    </>
                  )}
                  
                  {isFullyStaffed && (
                    <Badge className="bg-green-50 text-green-700 border border-green-200 justify-center py-2">
                      Fully Staffed
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}