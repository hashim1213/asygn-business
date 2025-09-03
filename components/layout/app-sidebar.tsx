"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Calendar, Activity, Users, Settings, Zap, X, ChevronLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppContext } from "@/lib/context/app-context"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { id: "shifts", label: "Events", icon: Calendar, href: "/events" },
  { id: "workers", label: "Hire a Pro", icon: Users, href: "/workers" },
  { id: "messages", label: "Messages", icon: MessageCircle, href: "/messages" },
  { id: "staff", label: "Live Staff", icon: Activity, href: "/staff" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

interface AppSidebarProps {
  onQuickFill: () => void
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function AppSidebar({ 
  onQuickFill, 
  isOpen = true, 
  onClose, 
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse
}: AppSidebarProps) {
  const pathname = usePathname()
  const { state } = useAppContext()

  const getItemBadge = (itemId: string) => {
    switch (itemId) {
      case "shifts":
        return state.shifts?.filter((s) => s.status === "published").length || 0
      case "staff":
        return state.staff?.filter((s) => s.status === "active").length || 0
      case "messages":
        // Show unread messages count
        return state.messages?.filter((m) => !m.isRead).length || 0
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
              {!isCollapsed || isMobile ? (
                <div className="flex items-center space-x-3">
                  <img 
                    src="/asygn.png" 
                    alt="Asygn" 
                    className="h-6 w-auto flex-shrink-0"
                  />
                </div>
              ) : (
                <img 
                  src="/asygn.png" 
                  alt="Asygn" 
                  className="h-6 w-auto mx-auto"
                />
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
            {sidebarItems.map((item) => {
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
                            item.id === "messages" ? "bg-blue-600" : "bg-gray-700"
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

        {/* Quick Actions - Only show when not collapsed or on mobile */}
        {(!isCollapsed || isMobile) && (
          <div className="p-3 border-t border-gray-100">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-red-100 rounded-md">
                  <Zap className="h-3 w-3 text-red-600" />
                </div>
                <span className="font-medium text-red-900 text-xs">Emergency Fill</span>
              </div>
              <p className="text-xs text-red-700 mb-3">Need staff urgently?</p>
              <Button
                onClick={onQuickFill}
                size="sm"
                className="w-full bg-red-500 hover:bg-red-600 text-white shadow-sm text-xs"
              >
                <Zap className="h-3 w-3 mr-2" />
                Quick Fill
              </Button>
            </div>
          </div>
        )}

        {/* Footer Stats - Simplified for collapsed state */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          {!isCollapsed || isMobile ? (
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{state.stats?.activeShifts || 0}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{state.stats?.totalStaff || 0}</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{state.stats?.activeShifts || 0}</p>
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{state.stats?.totalStaff || 0}</p>
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}