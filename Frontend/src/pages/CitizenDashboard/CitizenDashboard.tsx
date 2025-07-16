"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MyLands } from "./section/MyLands"
import { SearchRecords } from "./section/SearchRecords"
// import LandTransferForm, { TransferLand } from "./section/TransferLand"
import { VerifyCertificate } from "./section/VerifyCertificate"
import { KYCStatus } from "./section/KycStatus"
import { TransactionHistory } from "./section/TransactionHistory"
import { ProfileSettings } from "./section/ProfileSetting"
import LandRegistrationForm from "./section/LandRegistry"
import LandTransferForm from "./section/TransferLand"

export default function CitizenDashboard() {
  const [activeSection, setActiveSectionState] = useState("my-lands")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Wrapper to also save to localStorage
  const setActiveSection = (section: string) => {
    localStorage.setItem("activeSection", section)
    setActiveSectionState(section)
  }

  useEffect(() => {
    const storedSection = localStorage.getItem("activeSection")
    if (storedSection) {
      setActiveSectionState(storedSection)
    }
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case "my-lands":
        return <MyLands />
      case "search":
        return <SearchRecords />
      case "transfer":
        return <LandTransferForm />
      case "verify":
        return <VerifyCertificate />
      case "kyc":
        return <KYCStatus />
      case "history":
        return <TransactionHistory />
      case "profile":
        return <ProfileSettings />
      case "upload":
        return <LandRegistrationForm />
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
