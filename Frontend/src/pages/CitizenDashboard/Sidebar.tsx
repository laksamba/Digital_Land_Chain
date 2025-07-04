
import {
  Home,
  Search,
  ArrowRightLeft,
  Shield,
  User,
  History,
  Upload,
  X,
  MapPin,
  CheckCircle,
  Settings,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const sidebarItems = [
  { id: "my-lands", label: "My Lands", icon: Home },
  { id: "search", label: "Search Records", icon: Search },
  { id: "transfer", label: "Transfer Land", icon: ArrowRightLeft },
  { id: "verify", label: "Verify Certificate", icon: Shield },
  { id: "kyc", label: "KYC Status", icon: User },
  { id: "history", label: "Transaction History", icon: History },
  { id: "upload", label: "Upload Documents", icon: Upload },
  { id: "profile", label: "Profile Settings", icon: Settings },
]

export function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col shadow-lg
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
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
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
            <p className="text-xs text-gray-500">ID: CIT-2024-001</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">KYC Status</span>
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
              <CheckCircle className="h-3 w-3" />
              <span className="font-medium">Verified</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Properties Owned</span>
            <span className="font-medium text-gray-900">2</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Active Transfers</span>
            <span className="font-medium text-gray-900">1</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Dashboard</div>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
              ${activeSection === item.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}
            `}
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
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2024 Land Registry</p>
          <p>Secure • Transparent • Digital</p>
        </div>
      </div>
    </div>
  )
}
