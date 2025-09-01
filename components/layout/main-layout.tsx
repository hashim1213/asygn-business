"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { QuickFillModal } from "../modals/quick-fill-modal"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  showCreateShift?: boolean
}

export function MainLayout({ 
  children, 
  title, 
  subtitle, 
  showCreateShift = true 
}: MainLayoutProps) {
  const [showQuickFill, setShowQuickFill] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
        setSidebarCollapsed(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCreateShift = () => {
    console.log("Create shift clicked")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar 
        onQuickFill={() => setShowQuickFill(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader 
          title={title} 
          subtitle={subtitle} 
          onCreateShift={showCreateShift ? handleCreateShift : undefined}
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={isMobile}
          notificationCount={3} // Example notification count
        />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      <QuickFillModal 
        isOpen={showQuickFill} 
        onClose={() => setShowQuickFill(false)} 
      />
    </div>
  )
}