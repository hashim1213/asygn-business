import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "success" | "warning" | "error" | "info"
  className?: string
}

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return <Badge className={cn(getVariantStyles(), className)}>{status}</Badge>
}
