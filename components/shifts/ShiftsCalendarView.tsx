import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Shift } from "@/components/shifts/data/mockData"

interface ShiftsCalendarViewProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  filteredShifts: Shift[]
  onShiftClick: (shift: Shift) => void
}

type CalendarView = 'month' | 'week' | 'today'

export function ShiftsCalendarView({ 
  currentDate, 
  setCurrentDate, 
  filteredShifts, 
  onShiftClick 
}: ShiftsCalendarViewProps) {
  const [calendarView, setCalendarView] = useState<CalendarView>('month')
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const getShiftsForDate = (date: Date | null) => {
    if (!date) return []
    const dateString = date.toISOString().split('T')[0]
    return filteredShifts.filter(shift => shift.date === dateString)
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getDateRangeLabel = () => {
    if (calendarView === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } else if (calendarView === 'week') {
      const weekDays = getWeekDays(currentDate)
      const startDate = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endDate = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${startDate} - ${endDate}`
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  const renderMonthView = () => {
    const monthDays = getDaysInMonth(currentDate)
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center p-3 font-medium text-gray-600 border-b text-sm">
            <span className="hidden sm:block">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}

        {/* Calendar Days */}
        {monthDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="min-h-16 sm:min-h-24 p-1 sm:p-2"></div>
          }

          const dayShifts = getShiftsForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()
          
          return (
            <div key={index} className={`min-h-16 sm:min-h-24 p-1 sm:p-2 border rounded-lg ${
              isToday ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
            }`}>
              <div className={`text-xs sm:text-sm mb-1 ${
                isToday ? 'text-orange-600 font-semibold' : 'text-gray-900'
              }`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayShifts.slice(0, 2).map((shift) => (
                  <div 
                    key={shift.id}
                    className={`p-1 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow ${
                      shift.status === 'urgent' ? 'bg-red-100 text-red-800' :
                      shift.status === 'filled' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                    onClick={() => onShiftClick(shift)}
                  >
                    <div className="font-medium truncate">{shift.title}</div>
                    <div className="text-gray-600 hidden sm:block">{shift.startTime}</div>
                  </div>
                ))}
                
                {dayShifts.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayShifts.length - 2}
                  </div>
                )}
                
                {dayShifts.length === 0 && (
                  <div className="text-center py-1 sm:py-2">
                    <div className="text-xs text-gray-300 hidden sm:block">No shifts</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    
    return (
      <div className="space-y-4">
        {/* Week Header */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div key={index} className={`text-center p-3 rounded-lg border ${
                isToday ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-xs font-medium text-gray-500">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Week Content */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayShifts = getShiftsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()
            
            return (
              <div key={index} className={`min-h-32 p-3 border rounded-lg ${
                isToday ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
              }`}>
                <div className="sm:hidden mb-2">
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayShifts.map((shift) => (
                    <div 
                      key={shift.id}
                      className={`p-2 rounded cursor-pointer hover:shadow-sm transition-shadow ${
                        shift.status === 'urgent' ? 'bg-red-100 text-red-800' :
                        shift.status === 'filled' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                      onClick={() => onShiftClick(shift)}
                    >
                      <div className="font-medium text-xs">{shift.title}</div>
                      <div className="text-xs text-gray-600">{formatTime(shift.startTime)}</div>
                      <div className="text-xs">
                        <Badge variant="secondary" className="text-xs px-1">
                          ${shift.hourlyRate}/h
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {dayShifts.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400">
                      No shifts
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTodayView = () => {
    const todayShifts = getShiftsForDate(currentDate)
    
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </h3>
          <p className="text-gray-500">
            {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {todayShifts.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts scheduled</h3>
            <p className="text-gray-500">You have no shifts scheduled for this day.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayShifts.map((shift) => (
              <Card 
                key={shift.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onShiftClick(shift)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{shift.title}</h3>
                        <Badge className={`text-xs ${
                          shift.status === 'urgent' ? 'bg-red-100 text-red-700' :
                          shift.status === 'filled' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{shift.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-semibold text-green-600">${shift.hourlyRate}/hour</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {shift.requirements.slice(0, 3).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {shift.requirements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{shift.requirements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Staffing</div>
                      <div className="text-lg font-semibold">
                        {shift.staffAssigned.length}/{shift.staffNeeded}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {getDateRangeLabel()}
            </h3>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {(['month', 'week', 'today'] as CalendarView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-3 py-1 text-xs sm:text-sm rounded transition-colors ${
                    calendarView === view 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
            
            <Button 
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Today
            </Button>
          </div>
        </div>

        {/* Calendar Content */}
        {calendarView === 'month' && renderMonthView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'today' && renderTodayView()}
      </CardContent>
    </Card>
  )
}