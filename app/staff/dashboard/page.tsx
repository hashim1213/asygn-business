// app/staff/dashboard/page.tsx
import StaffDashboard from '@/components/staff/staff-dashboard'
import { StaffMainLayout } from "@/components/staff/staff-main-layout"
export default function StaffDashboardPage() {
   
   return(<StaffMainLayout>

 <StaffDashboard />
  </StaffMainLayout>
  )
}