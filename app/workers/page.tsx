import { MainLayout } from "@/components/layout/main-layout"
import AsygnWorkersPlatform from "@/components/pages/workers-content"

export default function WorkersPage() {
  return (
    <MainLayout title="Workers" subtitle="" showCreateShift={false}>
      <AsygnWorkersPlatform />
    </MainLayout>
  )
}
