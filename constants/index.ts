import { ShiftCategory, UrgencyLevel } from "@/types"

export const SHIFT_CATEGORIES = [
  { value: ShiftCategory.HOSPITALITY, label: "Hospitality" },
  { value: ShiftCategory.RETAIL, label: "Retail" },
  { value: ShiftCategory.EVENTS, label: "Events" },
  { value: ShiftCategory.WAREHOUSE, label: "Warehouse" },
  { value: ShiftCategory.CLEANING, label: "Cleaning" },
  { value: ShiftCategory.SECURITY, label: "Security" },
  { value: ShiftCategory.HEALTHCARE, label: "Healthcare" },
  { value: ShiftCategory.OTHER, label: "Other" },
]

export const URGENCY_LEVELS = [
  { value: UrgencyLevel.LOW, label: "Low", color: "bg-green-100 text-green-800" },
  { value: UrgencyLevel.MEDIUM, label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: UrgencyLevel.HIGH, label: "High", color: "bg-orange-100 text-orange-800" },
  { value: UrgencyLevel.URGENT, label: "Urgent", color: "bg-red-100 text-red-800" },
]

export const COMMON_SKILLS = [
  "Customer Service",
  "Cash Handling",
  "Food Service",
  "Cleaning",
  "Security",
  "Warehouse",
  "Event Setup",
  "Sales",
  "Reception",
  "Data Entry",
  "Inventory",
  "Bartending",
  "Cooking",
  "Driving",
  "Heavy Lifting",
]

export const TIME_SLOTS = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
]

export const NOTIFICATION_TYPES = {
  SHIFT_CREATED: "shift_created",
  SHIFT_FILLED: "shift_filled",
  STAFF_CHECK_IN: "staff_check_in",
  STAFF_CHECK_OUT: "staff_check_out",
  EMERGENCY_ALERT: "emergency_alert",
  PAYMENT_PROCESSED: "payment_processed",
} as const

export const API_ENDPOINTS = {
  WORKERS: "/api/workers",
  SHIFTS: "/api/shifts",
  STAFF: "/api/staff",
  NOTIFICATIONS: "/api/notifications",
  ANALYTICS: "/api/analytics",
} as const

export const ROUTES = {
  DASHBOARD: "/",
  WORKERS: "/workers",
  SHIFTS: "/shifts",
  STAFF: "/staff",
  SETTINGS: "/settings",
} as const

export const COLORS = {
  PRIMARY: "#ff6b35", // Orange brand color
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
} as const
