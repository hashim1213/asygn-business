export const todayStats = [
  { title: "Active Staff", value: "8", subtitle: "Currently working", icon: "UserCheck", color: "text-green-600" },
  { title: "Open Shifts", value: "3", subtitle: "Need coverage", icon: "Calendar", color: "text-orange-600" },
  { title: "Fill Rate", value: "94%", subtitle: "This week", icon: "TrendingUp", color: "text-blue-600" },
  { title: "Avg Response", value: "12m", subtitle: "Worker response time", icon: "Clock", color: "text-purple-600" },
]

export const urgentShifts = [
  {
    id: "1",
    title: "Lunch Server",
    location: "Downtown Location",
    time: "11:30 AM - 3:00 PM",
    date: "Today",
    staffNeeded: 2,
    payRate: 18,
    urgency: "high" as const,
  },
  {
    id: "2",
    title: "Kitchen Prep",
    location: "Uptown Location",
    time: "2:00 PM - 6:00 PM",
    date: "Today",
    staffNeeded: 1,
    payRate: 16,
    urgency: "medium" as const,
  },
]

export const activeStaff = [
  {
    id: "1",
    name: "Sarah Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Server",
    location: "Downtown",
    status: "working" as const,
    startTime: "10:00 AM",
    progress: 65,
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Kitchen",
    location: "Downtown",
    status: "arriving" as const,
    startTime: "11:00 AM",
    eta: "8 min",
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Cashier",
    location: "Uptown",
    status: "break" as const,
    startTime: "9:00 AM",
    progress: 45,
  },
]

export const availableWorkers = [
  {
    id: "1",
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    distance: "1.2 mi",
    skills: ["Server", "Bartender"],
    hourlyRate: 18,
    responseTime: "< 15 min",
    available: true,
    completedJobs: 127,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Lisa Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    distance: "0.8 mi",
    skills: ["Kitchen", "Prep"],
    hourlyRate: 16,
    responseTime: "< 30 min",
    available: true,
    completedJobs: 89,
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.6,
    distance: "2.1 mi",
    skills: ["Cashier", "Customer Service"],
    hourlyRate: 15,
    responseTime: "< 45 min",
    available: false,
    completedJobs: 156,
    lastActive: "30 minutes ago",
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.7,
    distance: "1.5 mi",
    skills: ["Server", "Manager"],
    hourlyRate: 22,
    responseTime: "< 20 min",
    available: true,
    completedJobs: 203,
    lastActive: "15 minutes ago",
  },
  {
    id: "5",
    name: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.5,
    distance: "3.2 mi",
    skills: ["Kitchen", "Bartender"],
    hourlyRate: 19,
    responseTime: "< 1 hour",
    available: true,
    completedJobs: 78,
    lastActive: "4 hours ago",
  },
  {
    id: "6",
    name: "Sophie Turner",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    distance: "0.5 mi",
    skills: ["Server", "Customer Service"],
    hourlyRate: 17,
    responseTime: "< 10 min",
    available: false,
    completedJobs: 234,
    lastActive: "1 hour ago",
  },
]

export type StaffStatus = "working" | "arriving" | "break"

export const getStatusColor = (status: StaffStatus): string => {
  switch (status) {
    case "working":
      return "bg-green-500"
    case "arriving":
      return "bg-yellow-500"
    case "break":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}
