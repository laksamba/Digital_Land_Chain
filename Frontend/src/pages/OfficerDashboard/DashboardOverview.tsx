"use client";

import {
  FileText,
  Shield,
  ClipboardList,
  Scale,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { getDashboardMetrics, getRecentActivity } from "../../api/adminApi";
import { useState, useEffect, type JSX } from "react";

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
}

export function DashboardOverview({}: DashboardOverviewProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState<boolean>(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard metrics
        const metricsData = await getDashboardMetrics();
        console.log("Dashboard Metrics:", metricsData);
        setMetrics(metricsData);

        // Fetch recent activities
        try {
          setIsLoadingActivities(true);
          const activitiesData = await getRecentActivity();
          console.log("Recent Activities Response:", activitiesData);

          // Check if response has recentUsers and recentLands
          if (
            activitiesData &&
            activitiesData.recentUsers &&
            activitiesData.recentLands
          ) {
            const combinedActivities = [
              ...activitiesData.recentUsers
                .filter((user: any) => user.kyc?.verified) // Only include verified users
                .map((user: any) => ({
                  type: "kyc_submitted",
                  description: `KYC verified for ${
                    user.kyc?.fullName?.english || user.name || "Unknown User"
                  }`,
                  timestamp:
                    user.kyc?.verifiedAt ||
                    user.createdAt ||
                    new Date().toISOString(),
                })),
              ...activitiesData.recentLands
                .filter((land: any) => land.status === "verified") // Only include verified lands
                .map((land: any) => ({
                  type: "land_verified",
                  description: `Land ID ${land.landId} in ${land.location} verified`,
                  timestamp:
                    land.verifiedAt ||
                    land.createdAt ||
                    new Date().toISOString(),
                })),
            ].sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );

            console.log("Combined Activities:", combinedActivities);
            setRecentActivities(combinedActivities);
          } else {
            console.warn("Invalid activities data format:", activitiesData);
            setRecentActivities([]);
            setActivityError("Invalid activities data format");
          }
        } catch (error) {
          console.error("Error fetching recent activities:", error);
          setRecentActivities([]);
          setActivityError("Failed to load recent activities");
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setMetrics(null);
        setActivityError("Failed to load data");
      } finally {
        setIsLoadingActivities(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setLastUpdated(new Date(lastUpdated));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Map activity types to icons
  const activityIcons: { [key: string]: JSX.Element } = {
    transfer_approved: (
      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
    ),
    kyc_submitted: <Shield className="h-4 w-4 mt-0.5 text-blue-600" />,
    dispute_filed: <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600" />,
    certificate_issued: <Award className="h-4 w-4 mt-0.5 text-purple-600" />,
    land_verified: <ClipboardList className="h-4 w-4 mt-0.5 text-purple-600" />,
    unknown: <CheckCircle className="h-4 w-4 mt-0.5 text-gray-600" />,
  };

  // Map activity types to titles
  const activityTitles: { [key: string]: string } = {
    transfer_approved: "Transfer Request Approved",
    kyc_submitted: "KYC Documents Submitted",
    dispute_filed: "Dispute Filed",
    certificate_issued: "Certificate Issued",
    land_verified: "Land Verified",
    unknown: "Unknown Activity",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Welcome back, Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            Last updated: {lastUpdated ? getTimeAgo(lastUpdated) : "Loading..."}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Transfer Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Transfer Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.pendingLandTransfer ?? "Loading..."}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* KYC Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">KYC Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.pendingKyc ?? "Loading..."}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Registry Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Registry Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.pendingLandRegistry ?? "Loading..."}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <ClipboardList className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Active Disputes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Disputes
              </p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50">
              <Scale className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities and Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5" />
            Recent Activities
          </div>
          <div className="p-4 space-y-4">
            {isLoadingActivities ? (
              <p className="text-sm text-gray-600">Loading activities...</p>
            ) : activityError ? (
              <p className="text-sm text-red-600">{activityError}</p>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100"
                >
                  {activityIcons[activity.type] || (
                    <CheckCircle className="h-4 w-4 mt-0.5 text-gray-600" />
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {activityTitles[activity.type] || "Unknown Activity"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activity.description || "No description available"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp
                        ? getTimeAgo(new Date(activity.timestamp))
                        : "Unknown time"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">
                No recent activities found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Button Styles */}
      <style>{`
        .quick-action {
          height: 5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: background-color 0.2s ease;
        }
        .quick-action:hover {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}
