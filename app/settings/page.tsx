import { MainLayout } from "@/components/layout/main-layout"
import { SettingsContent } from "@/components/pages/settings-content"

export default function SettingsPage() {
  return (
    <MainLayout 
      title="Settings" 
      subtitle=""
      showCreateShift={false}
    >
      <SettingsContent />
    </MainLayout>
  )
}
