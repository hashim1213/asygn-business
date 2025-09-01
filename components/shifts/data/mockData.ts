// Mock data with assigned staff
export const mockStaff = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      rating: 4.8, 
      avatar: "SJ", 
      phone: "+1 (555) 123-4567", 
      email: "sarah@email.com", 
      experience: "3 years", 
      completedShifts: 127 
    },
    { 
      id: 2, 
      name: "Mike Chen", 
      rating: 4.9, 
      avatar: "MC", 
      phone: "+1 (555) 234-5678", 
      email: "mike@email.com", 
      experience: "2 years", 
      completedShifts: 89 
    },
    { 
      id: 3, 
      name: "Emily Davis", 
      rating: 4.7, 
      avatar: "ED", 
      phone: "+1 (555) 345-6789", 
      email: "emily@email.com", 
      experience: "4 years", 
      completedShifts: 203 
    },
    { 
      id: 4, 
      name: "Alex Rodriguez", 
      rating: 4.6, 
      avatar: "AR", 
      phone: "+1 (555) 456-7890", 
      email: "alex@email.com", 
      experience: "1.5 years", 
      completedShifts: 56 
    }
  ]
  
  export const mockShifts = [
    {
      id: 1,
      title: "Morning Server",
      location: "Downtown Restaurant",
      date: "2025-08-27",
      startTime: "08:00",
      endTime: "16:00",
      hourlyRate: 18,
      staffNeeded: 3,
      staffAssigned: [1, 2],
      status: "urgent" as const,
      requirements: ["Food Service Experience", "Customer Service"],
      description: "Busy morning shift requiring experienced servers for breakfast and lunch service.",
    },
    {
      id: 2,
      title: "Event Bartender",
      location: "City Convention Center",
      date: "2025-08-28",
      startTime: "18:00",
      endTime: "02:00",
      hourlyRate: 25,
      staffNeeded: 2,
      staffAssigned: [3, 4],
      status: "filled" as const,
      requirements: ["Bartending License", "Event Experience"],
      description: "Corporate event requiring professional bartending service.",
    },
    {
      id: 3,
      title: "Kitchen Assistant",
      location: "Uptown Bistro",
      date: "2025-08-29",
      startTime: "10:00",
      endTime: "18:00",
      hourlyRate: 16,
      staffNeeded: 1,
      staffAssigned: [],
      status: "open" as const,
      requirements: ["Food Safety Certification"],
      description: "Kitchen support role for busy bistro lunch and dinner prep.",
    },
    {
      id: 4,
      title: "Lunch Server",
      location: "Midtown Cafe",
      date: "2025-09-02",
      startTime: "11:00",
      endTime: "15:00",
      hourlyRate: 17,
      staffNeeded: 2,
      staffAssigned: [1],
      status: "open" as const,
      requirements: ["Customer Service", "Cash Handling"],
      description: "Fast-paced lunch service requiring efficient servers.",
    },
    {
      id: 5,
      title: "Night Shift Cook",
      location: "24/7 Diner",
      date: "2025-09-05",
      startTime: "22:00",
      endTime: "06:00",
      hourlyRate: 22,
      staffNeeded: 1,
      staffAssigned: [],
      status: "urgent" as const,
      requirements: ["Cooking Experience", "Night Availability"],
      description: "Overnight cooking position for 24-hour diner operation.",
    },
    {
      id: 6,
      title: "Catering Server",
      location: "Grand Ballroom",
      date: "2025-09-10",
      startTime: "17:00",
      endTime: "23:00",
      hourlyRate: 20,
      staffNeeded: 4,
      staffAssigned: [1, 2, 3, 4],
      status: "filled" as const,
      requirements: ["Event Service", "Professional Attire"],
      description: "Upscale catering event requiring professional service staff.",
    }
  ]
  
  // Types
  export interface Staff {
    id: number
    name: string
    rating: number
    avatar: string
    phone: string
    email: string
    experience: string
    completedShifts: number
  }
  
  export interface Shift {
    id: number
    title: string
    location: string
    date: string
    startTime: string
    endTime: string
    hourlyRate: number
    staffNeeded: number
    staffAssigned: number[]
    status: 'urgent' | 'filled' | 'open'
    requirements: string[]
    description: string
  }