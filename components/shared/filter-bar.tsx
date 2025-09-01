"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterBarProps {
  children: ReactNode
  onReset?: () => void
  activeFiltersCount?: number
}

export function FilterBar({ children, onReset, activeFiltersCount = 0 }: FilterBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-500">
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>
    </div>
  )
}
