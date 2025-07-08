"use client"

import { useState } from "react"
import { AlertTriangle, Eye, Gavel, Clock, CheckCircle } from "lucide-react"

const disputes = [
  {
    id: "DIS001",
    property: "Plot 123, Sector A",
    claimant: "John Doe",
    respondent: "Jane Smith",
    type: "Ownership Dispute",
    description: "Conflicting ownership claims over the same property",
    filedDate: "2024-01-10",
    status: "open",
    priority: "high",
    evidence: 3,
  },
  {
    id: "DIS002",
    property: "House 456, Block B",
    claimant: "Mike Johnson",
    respondent: "City Council",
    type: "Boundary Dispute",
    description: "Disagreement over property boundary lines",
    filedDate: "2024-01-08",
    status: "under_investigation",
    priority: "medium",
    evidence: 5,
  },
  {
    id: "DIS003",
    property: "Land 789, Zone C",
    claimant: "Sarah Wilson",
    respondent: "Robert Brown",
    type: "Transfer Dispute",
    description: "Disputed transfer without proper consent",
    filedDate: "2024-01-05",
    status: "resolved",
    priority: "low",
    evidence: 2,
  },
]

export function DisputePanel() {
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <AlertTriangle className="h-3 w-3" />
            Open
          </span>
        )
      case "under_investigation":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            <Eye className="h-3 w-3" />
            Investigating
          </span>
        )
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>
      case "medium":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
      case "low":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Low</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{priority}</span>
    }
  }

  const handleResolve = (id: string) => {
    console.log("Resolving dispute:", id)
    setShowModal(false)
  }

  const openModal = (dispute: any) => {
    setSelectedDispute(dispute)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dispute Review Panel</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">7</div>
          <p className="text-sm text-gray-600">Open Disputes</p>
          <p className="text-xs text-gray-500">Require attention</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">4</div>
          <p className="text-sm text-gray-600">Under Investigation</p>
          <p className="text-xs text-gray-500">Being reviewed</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">15</div>
          <p className="text-sm text-gray-600">Resolved This Month</p>
          <p className="text-xs text-gray-500">Successfully closed</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-sm text-gray-600">Average Resolution</p>
          <p className="text-xs text-gray-500">Days to resolve</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Disputes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispute ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claimant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dispute.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{dispute.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{dispute.claimant}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{dispute.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{getPriorityBadge(dispute.priority)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(dispute.status)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(dispute)}
                      className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Dispute Details - {selectedDispute.id}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Property</label>
                  <p className="text-sm text-gray-900">{selectedDispute.property}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Dispute Type</label>
                  <p className="text-sm text-gray-900">{selectedDispute.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Claimant</label>
                  <p className="text-sm text-gray-900">{selectedDispute.claimant}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Respondent</label>
                  <p className="text-sm text-gray-900">{selectedDispute.respondent}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Filed Date</label>
                  <p className="text-sm text-gray-900">{selectedDispute.filedDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Evidence Files</label>
                  <p className="text-sm text-gray-900">{selectedDispute.evidence} documents</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{selectedDispute.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Resolution Notes</label>
                <textarea
                  placeholder="Add resolution notes and decision..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                <Clock className="h-4 w-4" />
                Request More Info
              </button>
              <button
                onClick={() => handleResolve(selectedDispute.id)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
              >
                <Gavel className="h-4 w-4" />
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
