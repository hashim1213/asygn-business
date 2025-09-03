import { MainLayout } from "@/components/layout/main-layout"
import { CreateEventContent } from "@/components/pages/events-create-content"

export default function CreateEventPage() {
  return (
    <MainLayout
      title="Create New Event"
      subtitle=""
      showCreateShift={false}
    >
      <CreateEventContent />
    </MainLayout>
  )
}