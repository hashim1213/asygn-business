import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: ReactNode
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatsCard({ title, value, change, icon, trend = "neutral", className }: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <p className={cn("text-xs flex items-center gap-1", getTrendColor())}>
                <span>{getTrendIcon()}</span>
                {Math.abs(change)}% from last month
              </p>
            )}
          </div>
          <div className="text-[#ff6b35] opacity-80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
