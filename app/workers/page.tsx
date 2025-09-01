import { MainLayout } from "@/components/layout/main-layout"
import { WorkersContent } from "@/components/pages/workers-content"

export default function WorkersPage() {
  return (
    <MainLayout title="Workers" subtitle="" showCreateShift={false}>
      <WorkersContent />
    </MainLayout>
  )
}
