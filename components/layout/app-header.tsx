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
import { Bell, Plus, Menu, Search, HelpCircle, User, LogOut, Settings } from "lucide-react"
import { useAppContext } from "@/lib/context/app-context"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title: string
  subtitle: string
  onCreateShift?: () => void
  onMenuClick?: () => void
  showMenuButton?: boolean
  notificationCount?: number
}

export function AppHeader({
  title,
  subtitle,
  onCreateShift,
  onMenuClick,
  showMenuButton = false,
  notificationCount = 0,
}: AppHeaderProps) {
  const { state } = useAppContext()

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
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
              {/* Quick status indicator */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm truncate mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {/* Search Button - Hidden on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex p-2 hover:bg-gray-100 rounded-md"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Help Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <Bell className="h-4 w-4" />
            </Button>
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-500 text-white text-xs border-2 border-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </div>

          {/* Create Shift Button - Desktop */}
          {onCreateShift && (
            <Button
              onClick={onCreateShift}
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm hidden sm:flex font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Shift
            </Button>
          )}

          {/* Create Shift Button - Mobile */}
          {onCreateShift && (
            <Button
              onClick={onCreateShift}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm sm:hidden p-2 rounded-md"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full hover:bg-gray-100 p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-orange-500 text-white text-sm font-medium">
                    BO
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Business Owner</p>
                  <p className="text-xs leading-none text-muted-foreground">owner@business.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <Badge className="ml-auto bg-red-100 text-red-700 hover:bg-red-100">
                    {notificationCount}
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Optional: Quick stats bar for mobile */}
      <div className="sm:hidden mt-3 flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <div className="flex items-center gap-4">
          <span>{state.stats?.activeShifts || 0} Active Shifts</span>
          <span>{state.stats?.totalStaff || 0} Staff Members</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Live</span>
        </div>
      </div>
    </header>
  )
}