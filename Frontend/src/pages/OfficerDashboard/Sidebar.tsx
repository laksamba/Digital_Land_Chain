"use client"

import {
  FileText,
  Shield,
  ClipboardList,
  Building2,
  User,

  Phone,
  Mail,
} from "lucide-react"
import { useEffect, useState } from "react"
import LogoutButton from "../../components/Logout"

const menuItems = [
  {
    id: "overview",
    title: "Dashboard Overview",
    icon: Building2,
    description: "Main dashboard view",
    count: 0,
  },
  {
    id: "transfers",
    title: "Transfer Requests",
    icon: FileText,
    description: "Review ownership transfers",
    count: 12,
  },
  {
    id: "kyc",
    title: "KYC Review",
    icon: Shield,
    description: "Verify citizen documents",
    
  },
  {
    id: "registry",
    title: "Registry Requests",
    icon: ClipboardList,
    description: "Land registration requests",

  },


  {
    id: "history",
    title: " Transaction History",
    icon: Building2,
    description: "Manage land records",
    count: 0,
  },

  {
    id: "documents",
    title: "Document Verification", 
    icon: FileText,
    description: "Verify uploaded documents",
    count: 0,
  },
]

interface AppSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  isOpen: boolean
}

export function AppSidebar({ activeSection, setActiveSection, isOpen }: AppSidebarProps) {
  const [officerProfile, setOfficerProfile] = useState({
    name: "Officer",
    title: "Land Officer",
    department: "Municipal Land Registry",

    email: "N/A",
    phone: "N/A",
    joinDate: "N/A",
  })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const user = JSON.parse(stored)
      setOfficerProfile({
        name: user.name || "Officer",
        title: "Land Officer",
        department: user.department || "Land Revenue  Registry",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        joinDate: new Date(user.createdAt).toLocaleDateString() || "N/A",
      })
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-gray-900">Land Revenue Officer Portal</span>
        </div>

        {/* Officer Profile Card */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {officerProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">{officerProfile.name}</h3>
              <p className="text-xs text-gray-600">{officerProfile.title}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-3 w-3" />
              <span>{officerProfile.department}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-3 w-3" />
              <span>{officerProfile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{officerProfile.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Land Management</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {/* {item.count > 0 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">{item.count}</span>
                )} */}
              </button>
            ))}
          </nav>
        </div>

       
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1 mb-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="h-4 w-4" />
            <span>Profile Settings</span>
          </button>
          <div className="p-4 border-t border-gray-200">
            <LogoutButton />
          </div>
        </nav>

        <div className="text-xs text-gray-500 text-center">
          <p>Joined {officerProfile.joinDate}</p>
          <p className="mt-1">Version 2.1.0</p>
        </div>
      </div>
    </div>
  )
}
