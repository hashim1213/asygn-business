import { MainLayout } from "@/components/layout/main-layout"
import { ShiftsContent } from "@/components/pages/shifts-content"

export default function ShiftsPage() {
  return (
    <MainLayout 
    title="Shifts" 
    subtitle=""
    showCreateShift={false}
  >
      <ShiftsContent />
    </MainLayout>
  )
}
