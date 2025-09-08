// app/booking/[id]/page.tsx
import EventManagement from '@/components/pages/event-content' // Adjust path as needed
import { MainLayout } from "@/components/layout/main-layout"

export default async function BookingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  return(
     <MainLayout
     
      showCreateShift={false}
    >
    
    <EventManagement bookingId={id} />
    </MainLayout>)
} 