import { MainLayout } from "@/components/layout/main-layout"
import BookingManagement from "@/components/pages/booking-content"

export default function EventsPage() {
  return (
    <MainLayout
     
      showCreateShift={false}
    >
      <BookingManagement />
    </MainLayout>
  ) 
}