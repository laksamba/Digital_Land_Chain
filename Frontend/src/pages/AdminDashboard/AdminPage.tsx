
import { useState } from "react"
import { DashboardOverview } from "./DashboardOverview"
import { AdminSidebar } from "./AdminSidebar"
import { UserManagement } from "./UserManagemet"


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "users":
        return <UserManagement />
      
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  )
}
