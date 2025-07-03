import { Home, Users, Settings, Shield, FileText, AlertTriangle } from "lucide-react";
import LogoutButton from "../../components/Logout";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: "overview", label: "Dashboard Overview", icon: Home },
  { id: "users", label: "User Management", icon: Users },
  { id: "settings", label: "System Settings", icon: Settings },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "audit", label: "Audit Logs", icon: FileText },
  { id: "disputes", label: "Dispute Management", icon: AlertTriangle },
];

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
      {/* Top - Logo + Menu */}
      <div>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-600">System Owner Panel</p>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Bottom - Logout */}
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );
}
