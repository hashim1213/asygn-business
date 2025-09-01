import { DashboardContent } from "@/components/dashboard-overview"
import { MainLayout } from "@/components/layout/main-layout"

export default function DashboardPage() {
  return (
    <MainLayout 
    title="Dashboard" 
    subtitle=""
    showCreateShift={true}
  >
  <DashboardContent />
</MainLayout>
)
}
