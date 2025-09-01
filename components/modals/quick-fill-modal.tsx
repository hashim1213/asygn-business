"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"

interface QuickFillModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickFillModal({ isOpen, onClose }: QuickFillModalProps) {
  if (!isOpen) return null

  const handleSubmit = () => {
    // Handle quick fill submission
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Quick Fill
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">What do you need?</label>
            <Input placeholder="e.g., Server for lunch rush" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">When?</label>
            <Input type="datetime-local" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">How many people?</label>
            <Input type="number" placeholder="1" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pay rate ($/hour)</label>
            <Input type="number" placeholder="18" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSubmit}>
              Find Workers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
