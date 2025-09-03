import { MainLayout } from "@/components/layout/main-layout"
import { EventShiftsContent } from "@/components/pages/events-shifts-content"

interface EventShiftsPageProps {
  params: {
    eventId: string
  }
}

export default function EventShiftsPage({ params }: EventShiftsPageProps) {
  return (
    <MainLayout
      title={`Event Shifts`}
      subtitle=""
      showCreateShift={false}
    >
      <EventShiftsContent eventId={params.eventId} />
    </MainLayout>
  )
}