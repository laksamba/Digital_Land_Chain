

import { useState } from "react"
import { Menu, Bell, LogOut, Settings, User, ChevronDown } from "lucide-react"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-900">Citizen Dashboard</h2>
            <p className="text-sm text-gray-500">Manage your land properties securely</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Verified Citizen</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="my-1 border-gray-200" />
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </header>
  )
}
