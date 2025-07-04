
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MyLands } from "./section/MyLands"
import { SearchRecords } from "./section/SearchRecords"
import { TransferLand } from "./section/TransferLand"
import { VerifyCertificate } from "./section/VerifyCertificate"
import { KYCStatus } from "./section/KycStatus"
import { TransactionHistory } from "./section/TransactionHistory"

import { ProfileSettings } from "./section/ProfileSetting"

export default function CitizenDashboard() {
  const [activeSection, setActiveSection] = useState("my-lands")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "my-lands":
        return <MyLands />
      case "search":
        return <SearchRecords />
      case "transfer":
        return <TransferLand />
      case "verify":
        return <VerifyCertificate />
      case "kyc":
        return <KYCStatus />
      case "history":
        return <TransactionHistory />
      case "profile":
        return <ProfileSettings />
      default:
        return <MyLands />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
