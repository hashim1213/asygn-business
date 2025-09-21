import { MainLayout } from "@/components/layout/main-layout"
import StaffContent  from "@/components/pages/staff-content"

export default function StaffPage() {
  return (
    <MainLayout 
  
    showCreateShift={false}
  >
      <StaffContent />
    </MainLayout>
  )
}
