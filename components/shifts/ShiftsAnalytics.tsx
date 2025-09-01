import { Card, CardContent } from "@/components/ui/card"
import { Calendar, AlertCircle, CheckCircle, DollarSign } from "lucide-react"
import { Shift } from"@/components/shifts/data/mockData"

interface ShiftsAnalyticsProps {
  shifts: Shift[]
}

export function ShiftsAnalytics({ shifts }: ShiftsAnalyticsProps) {
  const totalStaffNeeded = shifts.reduce((sum, shift) => sum + shift.staffNeeded, 0)
  const totalStaffAssigned = shifts.reduce((sum, shift) => sum + shift.staffAssigned.length, 0)
  const averageHourlyRate = Math.round(shifts.reduce((sum, shift) => sum + shift.hourlyRate, 0) / shifts.length)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
              <p className="text-xs text-orange-600 mt-1">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{shifts.filter(s => s.status === 'urgent').length}</p>
              <p className="text-xs text-red-600 mt-1">Need immediate fill</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fill Rate</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((totalStaffAssigned / totalStaffNeeded) * 100)}%</p>
              <p className="text-xs text-green-600 mt-1">{totalStaffAssigned}/{totalStaffNeeded} positions</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Rate</p>
              <p className="text-2xl font-bold text-gray-900">${averageHourlyRate}</p>
              <p className="text-xs text-blue-600 mt-1">Per hour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}