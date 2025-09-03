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
  Plus, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  Clock,
  Calendar,
  Zap
} from "lucide-react"

// Mock context - replace with your actual context
const mockContext = {
  state: {
    stats: {
      activeShifts: 3,
      totalStaff: 12,
      pendingMessages: 2,
      urgentNotifications: 1
    },
    user: {
      name: "Sarah Chen",
      email: "sarah@modernbistro.com",
      businessName: "Modern Bistro",
      avatar: null
    },
    quickStats: {
      todayEvents: 2,
      nextEventTime: "2:00 PM"
    }
  }
}

interface AppHeaderProps {
  title: string
  subtitle: string
  onCreateShift?: () => void
  onMenuClick?: () => void
  showMenuButton?: boolean
  notificationCount?: number
  messageCount?: number
}

export function AppHeader({
  title,
  subtitle,
  onCreateShift,
  onMenuClick,
  showMenuButton = false,
  notificationCount = 0,
  messageCount = 0,
}: AppHeaderProps) {
  const { state } = mockContext
  
  const totalMessages = messageCount || state.stats?.pendingMessages || 0
  const totalNotifications = notificationCount || state.stats?.urgentNotifications || 0

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section - More Human Context */}
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
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                  {title}
                </h1>
                <div className="flex items-center gap-4 mt-0.5">
                  <p className="text-gray-600 text-sm truncate">{subtitle}</p>
                  {/* Human-friendly quick context */}
                  <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
                    {state.quickStats.todayEvents > 0 && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{state.quickStats.todayEvents} events today</span>
                      </div>
                    )}
                    {state.quickStats.nextEventTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Next at {state.quickStats.nextEventTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Better organized */}
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
          
       

          {/* Notifications - Improved */}
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

       

          {/* Quick Actions Dropdown - Mobile */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onCreateShift}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Event
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="mr-2 h-4 w-4 text-red-500" />
                  Emergency Fill
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Create Event Button - Desktop (Improved) */}
          {onCreateShift && (
            <Button
              onClick={onCreateShift}
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm hidden sm:flex font-medium px-4"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}

          {/* User Menu - More Personal */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full hover:bg-gray-100 p-0 ml-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={state.user.avatar || undefined} alt={state.user.name} />
                  <AvatarFallback className="bg-orange-500 text-white text-sm font-medium">
                    {state.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div>
                    <p className="text-sm font-medium leading-none">Hi, {state.user.name.split(' ')[0]}! 👋</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">{state.user.businessName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{state.user.email}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-900">{state.stats.activeShifts}</p>
                      <p className="text-xs text-gray-500">Active Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-900">{state.stats.totalStaff}</p>
                      <p className="text-xs text-gray-500">Staff Working</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
             
              
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Business Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {totalNotifications > 0 && (
                  <Badge className="ml-auto bg-red-100 text-red-700 hover:bg-red-100">
                    {totalNotifications}
                  </Badge>
                )}
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
      
      {/* Enhanced Mobile Quick Stats */}
      <div className="sm:hidden mt-3 p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">{state.stats.activeShifts} events live</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{state.stats.totalStaff} staff working</span>
          </div>
          {state.quickStats.nextEventTime && (
            <div className="text-xs text-orange-600 font-medium">
              Next: {state.quickStats.nextEventTime}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}