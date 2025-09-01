import type { Worker, Shift, Staff, DashboardStats } from "@/types"
import { WorkerAvailability, ShiftStatus, StaffStatus, ShiftCategory, UrgencyLevel } from "@/types"

export const mockWorkers: Worker[] = [
  {
    id: "1",
    name: "Sarah Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    reviewCount: 24,
    skills: ["Server", "Bartender", "Customer Service"],
    hourlyRate: 22,
    distance: 0.8,
    availability: WorkerAvailability.AVAILABLE,
    completedJobs: 24,
    lastActive: "2 min ago",
    isVerified: true,
    bio: "Experienced server with excellent customer service skills and ability to work in fast-paced environments.",
    experience: 3,
    languages: ["English", "Spanish"],
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    reviewCount: 31,
    skills: ["Kitchen Prep", "Line Cook", "Food Safety"],
    hourlyRate: 20,
    distance: 1.2,
    availability: WorkerAvailability.BUSY,
    completedJobs: 31,
    lastActive: "1 min ago",
    isVerified: true,
    bio: "Dedicated kitchen professional with strong teamwork skills and attention to detail.",
    experience: 5,
    languages: ["English"],
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.6,
    reviewCount: 18,
    skills: ["Customer Service", "Retail", "Cash Handling"],
    hourlyRate: 18,
    distance: 2.1,
    availability: WorkerAvailability.AVAILABLE,
    completedJobs: 18,
    lastActive: "5 min ago",
    isVerified: false,
    bio: "Reliable part-time worker specializing in customer-facing roles.",
    experience: 2,
    languages: ["English"],
  },
]

export const mockShifts: Shift[] = [
  {
    id: "1",
    title: "Weekend Server",
    description: "Busy weekend dinner service requiring experienced servers",
    date: "2024-12-28",
    startTime: "17:00",
    endTime: "23:00",
    location: "Downtown Location",
    hourlyRate: 20,
    requiredSkills: ["Server", "Customer Service"],
    status: ShiftStatus.PUBLISHED,
    assignedWorkers: [mockWorkers[0]],
    maxWorkers: 3,
    urgency: UrgencyLevel.HIGH,
    category: ShiftCategory.HOSPITALITY,
    requirements: ["Food safety certification", "2+ years experience"],
    benefits: ["Tips", "Meal included"],
  },
  {
    id: "2",
    title: "Kitchen Prep",
    description: "Morning prep work for busy lunch service",
    date: "2024-12-27",
    startTime: "08:00",
    endTime: "16:00",
    location: "Uptown Location",
    hourlyRate: 18,
    requiredSkills: ["Kitchen Prep", "Food Safety"],
    status: ShiftStatus.FILLED,
    assignedWorkers: [mockWorkers[1]],
    maxWorkers: 2,
    urgency: UrgencyLevel.MEDIUM,
    category: ShiftCategory.HOSPITALITY,
    requirements: ["Food safety certification"],
    benefits: ["Meal included"],
  },
]

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Sarah Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    position: "Server",
    status: StaffStatus.ACTIVE,
    location: "Downtown Location",
    shiftId: "1",
    checkInTime: "9:58 AM",
    performance: {
      efficiency: 85,
      punctuality: 95,
      rating: 4.8,
      completedTasks: 24,
      totalHours: 120,
    },
    contact: {
      phone: "(555) 123-4567",
      email: "sarah.martinez@email.com",
    },
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    position: "Kitchen Prep",
    status: StaffStatus.ON_BREAK,
    location: "Downtown Location",
    shiftId: "2",
    checkInTime: "8:55 AM",
    breakTime: "12:30 PM",
    performance: {
      efficiency: 92,
      punctuality: 88,
      rating: 4.9,
      completedTasks: 31,
      totalHours: 156,
    },
    contact: {
      phone: "(555) 234-5678",
      email: "mike.rodriguez@email.com",
    },
  },
]

export const mockDashboardStats: DashboardStats = {
  activeShifts: 8,
  totalStaff: 12,
  pendingApplications: 3,
  completionRate: 94,
  averageRating: 4.7,
  monthlySpend: 12450,
}

// Utility functions for mock data
export function getWorkerById(id: string): Worker | undefined {
  return mockWorkers.find((worker) => worker.id === id)
}

export function getShiftById(id: string): Shift | undefined {
  return mockShifts.find((shift) => shift.id === id)
}

export function getStaffById(id: string): Staff | undefined {
  return mockStaff.find((staff) => staff.id === id)
}

export function filterWorkersBySkills(skills: string[]): Worker[] {
  if (skills.length === 0) return mockWorkers
  return mockWorkers.filter((worker) => skills.some((skill) => worker.skills.includes(skill)))
}

export function filterShiftsByStatus(status: ShiftStatus): Shift[] {
  return mockShifts.filter((shift) => shift.status === status)
}

export function getUrgentShifts(): Shift[] {
  return mockShifts.filter((shift) => shift.urgency === UrgencyLevel.HIGH || shift.urgency === UrgencyLevel.URGENT)
}
