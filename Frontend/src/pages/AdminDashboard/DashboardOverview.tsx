import { useEffect, useState } from "react";
import {
  MapPin,
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  Shield,
} from "lucide-react";
import {
  getDashboardMetrics,
  getRecentActivity,
  getSystemHealth,
} from "../../api/adminApi";

export function DashboardOverview() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, activityRes, healthRes] = await Promise.all([
          getDashboardMetrics(),
          getRecentActivity(),
          getSystemHealth(),
        ]);
        setMetrics(metricsRes);
        setRecentActivity([
          ...activityRes.recentUsers.map((u: any) => ({
            action: "New user registration",
            user: u.name || u.email,
            time: new Date(u.createdAt).toLocaleString(),
            type: "success",
          })),
          ...activityRes.recentLands.map((l: any) => ({
            action: `New land registered (${l.location})`,
            user: l.owner?.name || "Unknown",
            time: new Date(l.createdAt).toLocaleString(),
            type: "info",
          })),
        ]);
        setSystemHealth(healthRes);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;

  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600">
          Monitor your platform's key metrics and activities
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Registered Lands"
          value={metrics.totalLands}
          icon={MapPin}
          color="text-green-600"
        />
        <MetricCard
          title="Active Users (30d)"
          value={metrics.activeUsersLastMonth}
          icon={Users}
          color="text-blue-600"
        />
        <MetricCard
          title="Pending Transactions"
          value={metrics.pendingTransactions}
          icon={Clock}
          color="text-orange-600"
        />
        <MetricCard
          title="Verified Lands"
          value={metrics.verifiedLands}
          icon={AlertCircle}
          color="text-purple-600"
        />

        <MetricCard
    title="Total Citizens"
    value={metrics.userRoles.totalCitizens}
    icon={Users}
    color="text-emerald-600"
  />
  <MetricCard
    title="Survey Officers"
    value={metrics.userRoles.totalSurveyOfficers}
    icon={Users}
    color="text-cyan-600"
  />
  <MetricCard
    title="Land Officers"
    value={metrics.userRoles.totalLandOfficers}
    icon={Users}
    color="text-indigo-600"
  />
  <MetricCard
    title="Banks"
    value={metrics.userRoles.totalBanks}
    icon={Users}
    color="text-yellow-600"
  />

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
          <div className="p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600">by {activity.user}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                      activity.type
                    )}`}
                  >
                    {activity.type}
                  </span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
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
          <div className="p-6 space-y-4">
            <HealthItem
              label="Database Status"
              value={systemHealth.database.status}
              healthy={systemHealth.database.status === "connected"}
            />
            <HealthItem
              label="Server Time"
              value={new Date(systemHealth.serverTime).toLocaleString()}
            />
            <HealthItem
              label="Uptime"
              value={`${Math.floor(systemHealth.uptime / 60)} mins`}
            />
            <HealthItem
              label="Memory (RSS)"
              value={`${(systemHealth.memoryUsage.rss / 1024 / 1024).toFixed(
                2
              )} MB`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function HealthItem({
  label,
  value,
  healthy = true,
}: {
  label: string;
  value: string;
  healthy?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          healthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
