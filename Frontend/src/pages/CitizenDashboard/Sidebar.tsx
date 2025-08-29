"use client"

import {
  Home,
  ArrowRightLeft,
  User,
  History,
  Upload,
  X,
  MapPin,
  CheckCircle,
  Settings,
} from "lucide-react"
import { useEffect, useState } from "react"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

interface UserType {
  name: string
  email: string
  role: string
  walletAddress?: string // Make walletAddress optional to handle cases where it’s not yet set
  kycStatus: string
  id: string
}

const sidebarItems = [
  { id: "my-lands", label: "My Lands", icon: Home },
  { id: "upload", label: "Land Registration", icon: Upload },
  { id: "transfer", label: "Transfer Land", icon: ArrowRightLeft },
  { id: "finalized", label: "Finalized Transfers", icon: CheckCircle },
  { id: "history", label: "Transaction History", icon: History },
  { id: "kyc", label: "KYC Status", icon: User },
  { id: "profile", label: "Profile Settings", icon: Settings },
  { id: "document", label: "Document Upload", icon: Upload },
]

// Function to decode JWT token
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    console.log("Stored User:", storedUser)
    console.log("Stored Token:", token)

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log("Parsed User:", parsedUser)

        // Decode the token to get walletAddress
        const decodedToken = decodeJWT(token)
        if (decodedToken && decodedToken.walletAddress && !parsedUser.walletAddress) {
          // Update user object with walletAddress
          const updatedUser = {
            ...parsedUser,
            walletAddress: decodedToken.walletAddress,
          }

          // Save updated user to local storage
          localStorage.setItem("user", JSON.stringify(updatedUser))
          console.log("Updated User with Wallet Address:", updatedUser)
          setUser(updatedUser)
        } else {
          // If walletAddress already exists or token decoding fails, use the parsed user
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
      }
    }
  }, [])

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col shadow-lg
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Land Registry</h1>
        </div>
        <button
          className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.slice(0, 2).toUpperCase() || "??"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-gray-900">{user?.name || "Unknown User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "No Email"}</p>
            <p className="text-xs text-gray-500 truncate">Id: ... {user?.id.slice(-15) || "N/A"}</p>
            <p className="text-xs text-gray-500 truncate">
             Address: {user?.walletAddress 
    ? `${user.walletAddress.slice(0, 3).toUpperCase()}...${user.walletAddress.slice(-6).toUpperCase()}`
    : "No Wallet"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">KYC Status</span>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                user?.role === "citizen"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <CheckCircle className="h-3 w-3" />
              <span className="font-medium">{user?.kycStatus || "Unknown"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Dashboard</div>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveSection(item.id)
              setSidebarOpen(false)
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>© 2025 Land Registry</p>
        <p>Secure • Transparent • Digital</p>
      </div>
    </div>
  )
}