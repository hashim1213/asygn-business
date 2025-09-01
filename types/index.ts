// Core entity types
export interface Worker {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  skills: string[]
  hourlyRate: number
  distance: number
  availability: WorkerAvailability
  completedJobs: number
  lastActive: string
  isVerified: boolean
  bio?: string
  experience: number // years
  languages: string[]
}

export interface Shift {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  hourlyRate: number
  requiredSkills: string[]
  status: ShiftStatus
  assignedWorkers: Worker[]
  maxWorkers: number
  urgency: UrgencyLevel
  category: ShiftCategory
  requirements?: string[]
  benefits?: string[]
}

export interface Staff {
  id: string
  name: string
  avatar: string
  position: string
  status: StaffStatus
  location: string
  shiftId?: string
  checkInTime?: string
  breakTime?: string
  performance: StaffPerformance
  contact: ContactInfo
}

export interface Business {
  id: string
  name: string
  logo?: string
  industry: string
  locations: BusinessLocation[]
  settings: BusinessSettings
  subscription: SubscriptionInfo
  stats: BusinessStats
}

// Enums for better type safety
export enum WorkerAvailability {
  AVAILABLE = "available",
  BUSY = "busy",
  OFFLINE = "offline",
}

export enum ShiftStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  FILLED = "filled",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum StaffStatus {
  CHECKED_IN = "checked-in",
  ON_BREAK = "on-break",
  ACTIVE = "active",
  CHECKED_OUT = "checked-out",
  LATE = "late",
  NO_SHOW = "no-show",
}

export enum UrgencyLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum ShiftCategory {
  HOSPITALITY = "hospitality",
  RETAIL = "retail",
  EVENTS = "events",
  WAREHOUSE = "warehouse",
  CLEANING = "cleaning",
  SECURITY = "security",
  HEALTHCARE = "healthcare",
  OTHER = "other",
}

// Supporting interfaces
export interface StaffPerformance {
  efficiency: number
  punctuality: number
  rating: number
  completedTasks: number
  totalHours: number
}

export interface ContactInfo {
  phone: string
  email: string
  emergencyContact?: string
}

export interface BusinessLocation {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  isActive: boolean
}

export interface BusinessSettings {
  notifications: NotificationSettings
  hiring: HiringSettings
  payment: PaymentSettings
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  shiftReminders: boolean
  staffUpdates: boolean
  emergencyAlerts: boolean
}

export interface HiringSettings {
  autoApprove: boolean
  requireBackground: boolean
  minimumRating: number
  maxDistance: number
}

export interface PaymentSettings {
  defaultRate: number
  currency: string
  paymentMethod: string
  billingAddress: string
}

export interface SubscriptionInfo {
  plan: string
  status: string
  nextBilling: string
  features: string[]
}

export interface BusinessStats {
  totalShifts: number
  activeStaff: number
  completionRate: number
  averageRating: number
  totalSpent: number
  monthlyGrowth: number
}

// Form and UI types
export interface ShiftFormData {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  hourlyRate: number
  requiredSkills: string[]
  maxWorkers: number
  category: ShiftCategory
  requirements: string[]
  benefits: string[]
}

export interface WorkerFilters {
  skills: string[]
  availability: WorkerAvailability[]
  minRating: number
  maxDistance: number
  maxRate: number
  sortBy: "rating" | "distance" | "rate" | "experience"
}

export interface DashboardStats {
  activeShifts: number
  totalStaff: number
  pendingApplications: number
  completionRate: number
  averageRating: number
  monthlySpend: number
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Utility types
export type CreateShiftRequest = Omit<Shift, "id" | "status" | "assignedWorkers">
export type UpdateShiftRequest = Partial<CreateShiftRequest>
export type WorkerSummary = Pick<Worker, "id" | "name" | "avatar" | "rating" | "skills">
export type ShiftSummary = Pick<Shift, "id" | "title" | "date" | "status" | "location">

// Event types for real-time updates
export interface StaffUpdateEvent {
  type: "status_change" | "location_update" | "check_in" | "check_out" | "break_start" | "break_end"
  staffId: string
  timestamp: string
  data: any
}

export interface ShiftUpdateEvent {
  type: "created" | "updated" | "filled" | "started" | "completed" | "cancelled"
  shiftId: string
  timestamp: string
  data: any
}
