import { MainLayout } from "@/components/layout/main-layout"
import { EventsContent } from "@/components/pages/events-content"

export default function EventsPage() {
  return (
    <MainLayout
      title="Events & Jobs"
      subtitle=""
      showCreateShift={false}
    >
      <EventsContent />
    </MainLayout>
  )
}