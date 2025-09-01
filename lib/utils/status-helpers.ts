import type { StaffStatus, ShiftStatus, WorkerAvailability } from "@/types"

export function getStaffStatusConfig(status: StaffStatus) {
  switch (status) {
    case "checked-in":
      return {
        color: "bg-green-500",
        text: "Checked In",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      }
    case "active":
      return {
        color: "bg-green-500",
        text: "Active",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      }
    case "on-break":
      return {
        color: "bg-blue-500",
        text: "On Break",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      }
    case "checked-out":
      return {
        color: "bg-gray-500",
        text: "Checked Out",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
      }
    case "late":
      return {
        color: "bg-yellow-500",
        text: "Late",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
      }
    case "no-show":
      return {
        color: "bg-red-500",
        text: "No Show",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      }
    default:
      return {
        color: "bg-gray-500",
        text: "Unknown",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
      }
  }
}

export function getShiftStatusConfig(status: ShiftStatus) {
  switch (status) {
    case "draft":
      return {
        color: "bg-gray-100 text-gray-700",
        text: "Draft",
        variant: "secondary" as const,
      }
    case "published":
      return {
        color: "bg-blue-100 text-blue-700",
        text: "Published",
        variant: "info" as const,
      }
    case "filled":
      return {
        color: "bg-green-100 text-green-700",
        text: "Filled",
        variant: "success" as const,
      }
    case "in-progress":
      return {
        color: "bg-yellow-100 text-yellow-700",
        text: "In Progress",
        variant: "warning" as const,
      }
    case "completed":
      return {
        color: "bg-green-100 text-green-700",
        text: "Completed",
        variant: "success" as const,
      }
    case "cancelled":
      return {
        color: "bg-red-100 text-red-700",
        text: "Cancelled",
        variant: "error" as const,
      }
    default:
      return {
        color: "bg-gray-100 text-gray-700",
        text: "Unknown",
        variant: "default" as const,
      }
  }
}

export function getWorkerAvailabilityConfig(availability: WorkerAvailability) {
  switch (availability) {
    case "available":
      return {
        color: "bg-green-500",
        text: "Available",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      }
    case "busy":
      return {
        color: "bg-yellow-500",
        text: "Busy",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
      }
    case "offline":
      return {
        color: "bg-gray-500",
        text: "Offline",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
      }
    default:
      return {
        color: "bg-gray-500",
        text: "Unknown",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
      }
  }
}
