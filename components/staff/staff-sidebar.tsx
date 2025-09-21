"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Calendar, User, Wallet, MessageCircle, Settings, Clock, X, ChevronLeft, Briefcase, Star } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const staffSidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/staff/dashboard" },
  
  { id: "schedule", label: "My Schedule", icon: Calendar, href: "/staff/schedule" },
  { id: "availability", label: "Availability", icon: Clock, href: "/staff/availability" },
  { id: "messages", label: "Messages", icon: MessageCircle, href: "/staff/messages" },
  { id: "earnings", label: "Earnings", icon: Wallet, href: "/staff/earnings" },
 
  
]

interface StaffSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function StaffSidebar({ 
  isOpen = true, 
  onClose, 
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse
}: StaffSidebarProps) {
  const pathname = usePathname()

  // Mock data - replace with actual context/state
  const staffStats = {
    pendingJobs: 3,
    unreadMessages: 2,
    upcomingShifts: 1,
    weeklyEarnings: 1250
  }

  const getItemBadge = (itemId: string) => {
    switch (itemId) {
      case "jobs":
        return staffStats.pendingJobs || 0
      case "messages":
        return staffStats.unreadMessages || 0
      case "schedule":
        return staffStats.upcomingShifts || 0
      default:
        return 0
    }
  }

  const sidebarWidth = isCollapsed ? "w-16" : "w-64"

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
          isMobile
            ? cn("fixed inset-y-0 left-0 z-50 w-64 transform shadow-2xl", isOpen ? "translate-x-0" : "-translate-x-full")
            : cn(sidebarWidth, "relative"),
        )}
      >
        {/* Header with Logo */}
        <div className={cn("p-4 border-b border-gray-100", isCollapsed && !isMobile && "px-2")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              {(!isCollapsed || isMobile) && (
                <div className="flex items-center space-x-3">
                  
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900">Staff Portal</div>
                   
                  </div>
                </div>
              )}
              {isCollapsed && !isMobile && (
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            {/* Mobile Close Button */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-md flex-shrink-0"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
            
            {/* Desktop Collapse Button */}
            {!isMobile && onToggleCollapse && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-gray-100 rounded-md flex-shrink-0"
              >
                <ChevronLeft className={cn("h-4 w-4 text-gray-500 transition-transform", isCollapsed && "rotate-180")} />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {staffSidebarItems.map((item) => {
              const isActive = pathname === item.href
              const badgeCount = getItemBadge(item.id)

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={isMobile ? onClose : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      isCollapsed && !isMobile && "justify-center px-2"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors flex-shrink-0",
                        isActive ? "text-orange-600" : "text-gray-500 group-hover:text-gray-700",
                      )}
                    />
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {badgeCount > 0 && (
                          <Badge 
                            className={cn(
                              "text-xs px-1.5 py-0.5 font-medium ml-auto",
                              isActive 
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : item.id === "messages"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : item.id === "jobs"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                            )}
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isMobile && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.label}
                        {badgeCount > 0 && (
                          <span className={cn(
                            "ml-2 px-1.5 py-0.5 rounded text-xs",
                            item.id === "messages" ? "bg-blue-600" : 
                            item.id === "jobs" ? "bg-green-600" : "bg-gray-700"
                          )}>
                            {badgeCount}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

      </div>
    </>
  )
}