"use client"

import {
  FileText,
  Shield,
  ClipboardList,
  Scale,
  Award,
  Database,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  MapPin,
} from "lucide-react"

const dashboardStats = [
  {
    title: "Transfer Requests",
    value: "12",
    change: "+3 today",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "KYC Reviews",
    value: "8",
    change: "+2 pending",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Registry Requests",
    value: "15",
    change: "+5 this week",
    icon: ClipboardList,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Active Disputes",
    value: "3",
    change: "1 resolved",
    icon: Scale,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "approval",
    title: "Transfer Request Approved",
    description: "TR001 - Plot 123, Sector A approved for John Doe",
    time: "10 minutes ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "review",
    title: "KYC Documents Submitted",
    description: "New documents received for property verification",
    time: "25 minutes ago",
    icon: Shield,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "dispute",
    title: "Dispute Filed",
    description: "Boundary dispute for Plot 789, Zone C",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    id: 4,
    type: "certificate",
    title: "Certificate Issued",
    description: "Digital certificate CERT002 issued successfully",
    time: "2 hours ago",
    icon: Award,
    color: "text-purple-600",
  },
]

const workloadProgress = [
  {
    category: "Transfer Reviews",
    completed: 23,
    total: 35,
    percentage: 66,
  },
  {
    category: "KYC Verifications",
    completed: 18,
    total: 26,
    percentage: 69,
  },
  {
    category: "Registry Processing",
    completed: 12,
    total: 27,
    percentage: 44,
  },
  {
    category: "Dispute Resolutions",
    completed: 8,
    total: 11,
    percentage: 73,
  },
]

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const handleQuickAction = (section: string) => {
    if (onNavigate) {
      onNavigate(section)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back, Sarah! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            Last updated: 2 min ago
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activities
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                  <activity.icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workload Progress */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Today's Workload
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {workloadProgress.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="text-gray-600">
                      {item.completed}/{item.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{item.percentage}% completed</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => handleQuickAction("transfers")}
              className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-700">Review Transfers</span>
            </button>
            <button
              onClick={() => handleQuickAction("kyc")}
              className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-700">Verify KYC</span>
            </button>
            <button
              onClick={() => handleQuickAction("registry")}
              className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ClipboardList className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-700">Process Registry</span>
            </button>
            <button
              onClick={() => handleQuickAction("disputes")}
              className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Scale className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-700">Handle Disputes</span>
            </button>
            <button
              onClick={() => handleQuickAction("certificates")}
              className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Award className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-700">Issue Certificates</span>
            </button>
            <button
              onClick={() => handleQuickAction("manage")}
              className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Database className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-700">Manage Registry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Overview */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Distribution Overview
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <p className="text-sm text-gray-600">Total Properties</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1,198</div>
              <p className="text-sm text-gray-600">Active Properties</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">49</div>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
