import { MapPin, Users, Clock, AlertCircle, TrendingUp, Shield } from "lucide-react"

export function DashboardOverview() {
  const metrics = [
    {
      title: "Registered Lands",
      value: "12,847",
      change: "+5.2%",
      icon: MapPin,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: "8,432",
      change: "+12.1%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Pending Transactions",
      value: "156",
      change: "-8.3%",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Active Disputes",
      value: "23",
      change: "+2.1%",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  const recentActivity = [
    { action: "New user registration", user: "John Doe", time: "2 minutes ago", type: "success" },
    { action: "Land verification completed", user: "System", time: "5 minutes ago", type: "info" },
    { action: "Dispute raised", user: "Jane Smith", time: "10 minutes ago", type: "warning" },
    { action: "Smart contract deployed", user: "Admin", time: "15 minutes ago", type: "success" },
    { action: "KYC verification failed", user: "Bob Wilson", time: "20 minutes ago", type: "error" },
  ]

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600">Monitor your platform's key metrics and activities</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <p className="text-xs text-gray-600 mt-1">
              <span className={metric.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{metric.change}</span>{" "}
              from last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">by {activity.user}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(activity.type)}`}>
                      {activity.type}
                    </span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Health
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Database Status</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Smart Contract Status</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">API Response Time</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">125ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">System Uptime</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Security Alerts</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
