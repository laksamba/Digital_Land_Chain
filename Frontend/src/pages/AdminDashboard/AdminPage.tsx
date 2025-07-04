import { useState, useEffect } from "react"
import { DashboardOverview } from "./DashboardOverview"
import { AdminSidebar } from "./AdminSidebar"
import { UserManagement } from "./UserManagemet"
import AdminRoleAssignment from "./RolesMangement"

export default function AdminDashboard() {
  // Load initial section from localStorage or fallback to "overview"
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "overview"
  })

  // Save section to localStorage when changed
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection)
  }, [activeSection])

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "users":
        return <UserManagement />
      case "roles":
        return <AdminRoleAssignment />
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
