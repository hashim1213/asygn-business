"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  Clock,
  Calendar,
  DollarSign,
  Star,
  Briefcase,
  ToggleLeft,
  ToggleRight
} from "lucide-react"

// Mock staff context - replace with your actual context
const mockStaffContext = {
  state: {
    staff: {
      name: "Alex Johnson",
      email: "alex.j@staffconnect.com",
      specialization: "Bartender",
      rating: 4.8,
      totalJobs: 156,
      avatar: null,
      isAvailable: true
    },
    stats: {
      todayEarnings: 240,
      weeklyEarnings: 1250,
      pendingJobs: 3,
      upcomingShifts: 2,
      unreadMessages: 5,
      notifications: 2
    },
    quickStats: {
      nextShiftTime: "2:00 PM Today",
      lastPayoutAmount: 850
    }
  }
}

interface StaffHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  notificationCount?: number
  messageCount?: number
}

export function StaffHeader({
  onMenuClick,
  showMenuButton = false,
  notificationCount = 0,
  messageCount = 0,
}: StaffHeaderProps) {
  const { state } = mockStaffContext
  
  const totalMessages = messageCount || state.stats?.unreadMessages || 0
  const totalNotifications = notificationCount || state.stats?.notifications || 0

  const toggleAvailability = () => {
    // Toggle availability logic here
    console.log('Toggle availability')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenuClick} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div>
                <img 
                  src="/asygn.png" 
                  alt="Asygn Staff" 
                  className="h-6 w-auto flex-shrink-0"
                />
                <div className="flex items-center gap-4 mt-0.5">
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${state.staff.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={`font-medium ${state.staff.isAvailable ? 'text-green-700' : 'text-gray-600'}`}>
                      {state.staff.isAvailable ? 'Available for Work' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
          
          {/* Availability Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAvailability}
            className={`p-2 hover:bg-gray-100 rounded-md ${state.staff.isAvailable ? 'text-green-600' : 'text-gray-400'}`}
            title={`Set ${state.staff.isAvailable ? 'Unavailable' : 'Available'}`}
          >
            {state.staff.isAvailable ? (
              <ToggleRight className="h-5 w-5" />
            ) : (
              <ToggleLeft className="h-5 w-5" />
            )}
          </Button>

          {/* Messages */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-md"
              title="Messages"
            >
              <Bell className="h-4 w-4" />
            </Button>
            {totalMessages > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-500 hover:bg-blue-500 text-white text-xs border-2 border-white">
                {totalMessages > 9 ? "9+" : totalMessages}
              </Badge>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-md"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            {totalNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-500 text-white text-xs border-2 border-white">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </Badge>
            )}
          </div>

          {/* Quick Earnings Display - Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              ${state.stats.todayEarnings}
            </span>
            <span className="text-xs text-green-600">today</span>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full hover:bg-gray-100 p-0 ml-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={state.staff.avatar || undefined} alt={state.staff.name} />
                  <AvatarFallback className="bg-orange-500 text-white text-sm font-medium">
                    {state.staff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${state.staff.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={state.staff.avatar || undefined} alt={state.staff.name} />
                      <AvatarFallback className="bg-orange-500 text-white font-medium">
                        {state.staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{state.staff.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{state.staff.specialization}</p>
                      <p className="text-xs text-muted-foreground">{state.staff.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{state.staff.rating}</span>
                        <span className="text-xs text-gray-400">({state.staff.totalJobs} jobs)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">${state.stats.todayEarnings}</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">${state.stats.weeklyEarnings}</p>
                      <p className="text-xs text-gray-500">This Week</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{state.stats.upcomingShifts}</p>
                      <p className="text-xs text-gray-500">Upcoming</p>
                    </div>
                  </div>
                  
                  {/* Availability Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600">Work Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${state.staff.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-xs font-medium ${state.staff.isAvailable ? 'text-green-700' : 'text-gray-600'}`}>
                        {state.staff.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleAvailability}
                        className="p-1 h-auto text-xs"
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>My Schedule</span>
                {state.stats.upcomingShifts > 0 && (
                  <Badge className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100">
                    {state.stats.upcomingShifts}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Earnings & Payouts</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Available Jobs</span>
                {state.stats.pendingJobs > 0 && (
                  <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-100">
                    {state.stats.pendingJobs}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Quick Stats */}
      <div className="lg:hidden mt-3 p-3 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="font-medium text-green-700">${state.stats.todayEarnings} today</span>
            </div>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-gray-600">{state.staff.rating} rating</span>
            </div>
          </div>
          {state.quickStats.nextShiftTime && (
            <div className="text-xs text-orange-600 font-medium">
              Next: {state.quickStats.nextShiftTime}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}