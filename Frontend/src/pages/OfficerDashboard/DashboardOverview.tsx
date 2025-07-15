"use client";

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
} from "lucide-react";
import { getDashboardMetrics } from "../../api/adminApi";
import { useState, useEffect } from "react";



 const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));

    if (diffMin === 0) return "just now";
    if (diffMin === 1) return "1 min ago";
    return `${diffMin} min ago`;
  };


export function DashboardOverview() {
  const handleQuickAction = (section: string) => {
    console.log(`Navigating to ${section}`);
  };

  const [metrics, setMetrics] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getDashboardMetrics();
        console.log("Dashboard Metrics:", metrics);
        setMetrics(metrics);
       setLastUpdated(new Date()); 
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      }
    };
    fetchMetrics();
  }, []);
  useEffect(() => {
  const interval = setInterval(() => {
    if (lastUpdated) {
      setLastUpdated(new Date(lastUpdated)); 
    }
  }, 60000); 

  return () => clearInterval(interval);
}, [lastUpdated]);

 
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
                {metrics?.pendingLandTransfer}
              </p>
              <p className="text-xs text-gray-500 mt-1">+3 today</p>
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
                {metrics?.pendingKyc}
              </p>
              <p className="text-xs text-gray-500 mt-1">+2 pending</p>
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
                {metrics?.pendingLandRegistry}
              </p>
              <p className="text-xs text-gray-500 mt-1">+5 this week</p>
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
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500 mt-1">1 resolved</p>
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
            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Transfer Request Approved
                </h4>
                <p className="text-xs text-gray-600">
                  TR001 - Plot 123, Sector A approved for John Doe
                </p>
                <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <Shield className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  KYC Documents Submitted
                </h4>
                <p className="text-xs text-gray-600">
                  New documents received for property verification
                </p>
                <p className="text-xs text-gray-500 mt-1">25 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Dispute Filed
                </h4>
                <p className="text-xs text-gray-600">
                  Boundary dispute for Plot 789, Zone C
                </p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <Award className="h-4 w-4 mt-0.5 text-purple-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Certificate Issued
                </h4>
                <p className="text-xs text-gray-600">
                  Digital certificate CERT002 issued successfully
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Progress */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5" />
            Today's Workload
          </div>
          <div className="p-4 space-y-4">
            {[
              ["Transfer Reviews", 23, 35, 66],
              ["KYC Verifications", 18, 26, 69],
              ["Registry Processing", 12, 27, 44],
              ["Dispute Resolutions", 8, 11, 73],
            ].map(([title, done, total, percent], index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{title}</span>
                  <span className="text-gray-600">
                    {done}/{total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{percent}% completed</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 text-lg font-semibold text-gray-900">
          Quick Actions
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => handleQuickAction("transfers")}
            className="quick-action"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-700">Review Transfers</span>
          </button>
          <button
            onClick={() => handleQuickAction("kyc")}
            className="quick-action"
          >
            <Shield className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-700">Verify KYC</span>
          </button>
          <button
            onClick={() => handleQuickAction("registry")}
            className="quick-action"
          >
            <ClipboardList className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-700">Process Registry</span>
          </button>
          <button
            onClick={() => handleQuickAction("disputes")}
            className="quick-action"
          >
            <Scale className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-700">Handle Disputes</span>
          </button>
          <button
            onClick={() => handleQuickAction("certificates")}
            className="quick-action"
          >
            <Award className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-700">Issue Certificates</span>
          </button>
          <button
            onClick={() => handleQuickAction("manage")}
            className="quick-action"
          >
            <Database className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-700">Manage Registry</span>
          </button>
        </div>
      </div>

      {/* Map Overview */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Distribution Overview
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
