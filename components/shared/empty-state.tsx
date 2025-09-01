"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="bg-[#ff6b35] hover:bg-[#ff6b35]/90">
          {action.label}
        </Button>
      )}
    </div>
  )
}
