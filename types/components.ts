import type { ReactNode } from "react"
import type { Worker, Shift, Staff, WorkerFilters } from "./index"

// Component prop types
export interface LayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export interface WorkerCardProps {
  worker: Worker
  onHire: (workerId: string) => void
  onMessage: (workerId: string) => void
  onViewProfile: (workerId: string) => void
}

export interface ShiftCardProps {
  shift: Shift
  onEdit: (shiftId: string) => void
  onDuplicate: (shiftId: string) => void
  onCancel: (shiftId: string) => void
  onFill: (shiftId: string) => void
}

export interface StaffCardProps {
  staff: Staff
  onMessage: (staffId: string) => void
  onViewDetails: (staffId: string) => void
}

export interface FilterProps {
  filters: WorkerFilters
  onFiltersChange: (filters: WorkerFilters) => void
  onReset: () => void
}

export interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
}

export interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: ReactNode
  trend?: "up" | "down" | "neutral"
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export interface TabItem {
  id: string
  label: string
  count?: number
  icon?: ReactNode
}

// Form component types
export interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxSelections?: number
}

// Chart and visualization types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  category?: string
}

export interface PerformanceMetrics {
  efficiency: ChartDataPoint[]
  punctuality: ChartDataPoint[]
  satisfaction: ChartDataPoint[]
}
