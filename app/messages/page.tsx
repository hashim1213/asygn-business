import { MainLayout } from "@/components/layout/main-layout"
import MessagesPage from "@/components/pages/messages-content"

export default function EventsPage() {
  return (
    <MainLayout
     
      showCreateShift={false}
    >
      <MessagesPage/>
    </MainLayout>
  ) 
}