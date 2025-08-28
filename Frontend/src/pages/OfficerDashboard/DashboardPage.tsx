"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "./Sidebar"
import {DashboardOverview }from "./DashboardOverview"
import TransferRequests  from "./LandTransferRequest"
import { KYCReview } from "./KycReview"
import { RegistryRequests } from "./RegistryRequest"
import { TransactionHistory } from "../CitizenDashboard/section/TransactionHistory"

import { Bell, Menu } from "lucide-react"

export default function LandOfficerDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load active section from localStorage on component mount
  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection")
    if (savedSection) {
      setActiveSection(savedSection)
    }
  }, [])

  // Save active section to localStorage whenever it changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    localStorage.setItem("activeSection", section)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview onNavigate={handleSectionChange} />
      case "transfers":
        return <TransferRequests />
      case "kyc":
        return <KYCReview />
      case "registry":
        return <RegistryRequests />
      case "history":
        return <TransactionHistory />
      default:
        return <DashboardOverview onNavigate={handleSectionChange} />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return "Dashboard Overview"
      case "transfers":
        return "Transfer Requests"
      case "kyc":
        return "KYC Document Review"
      case "registry":
        return "Registry Requests"
      case "manage":
        return "Land Registry Management"
      case "history":
        return "Transaction History"
      default:
        return "Dashboard Overview"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden`}>
        <AppSidebar activeSection={activeSection} setActiveSection={handleSectionChange} isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">{getSectionTitle()}</h1>
          </div>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">{renderContent()}</div>

          {/* Notifications Panel
          {showNotifications && (
            <div className="w-80 border-l border-gray-200 bg-white">
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
