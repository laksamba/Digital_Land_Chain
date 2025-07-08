"use client"

import { useState } from "react"
import { Search, Eye, Check, X, Clock } from "lucide-react"

const transferRequests = [
  {
    id: "TR001",
    property: "Plot 123, Sector A",
    from: "John Doe",
    to: "Jane Smith",
    date: "2024-01-15",
    status: "pending",
    amount: "$50,000",
    documents: 4,
  },
  {
    id: "TR002",
    property: "House 456, Block B",
    from: "Mike Johnson",
    to: "Sarah Wilson",
    date: "2024-01-14",
    status: "under_review",
    amount: "$75,000",
    documents: 6,
  },
  {
    id: "TR003",
    property: "Land 789, Zone C",
    from: "Robert Brown",
    to: "Lisa Davis",
    date: "2024-01-13",
    status: "approved",
    amount: "$120,000",
    documents: 5,
  },
]

export function TransferRequests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            <Eye className="h-3 w-3" />
            Under Review
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <Check className="h-3 w-3" />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <X className="h-3 w-3" />
            Rejected
          </span>
        )
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
    }
  }

  const handleApprove = (id: string) => {
    console.log("Approving transfer:", id)
    setShowModal(false)
  }

  const handleReject = (id: string) => {
    console.log("Rejecting transfer:", id)
    setShowModal(false)
  }

  const openModal = (request: any) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ownership Transfer Requests</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transfer Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {transferRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.from}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.to}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.amount}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(request)}
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
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transfer Request Details - {selectedRequest.id}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Property</label>
                  <p className="text-sm text-gray-900">{selectedRequest.property}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Transfer Amount</label>
                  <p className="text-sm text-gray-900">{selectedRequest.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Owner</label>
                  <p className="text-sm text-gray-900">{selectedRequest.from}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">New Owner</label>
                  <p className="text-sm text-gray-900">{selectedRequest.to}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Review Notes</label>
                <textarea
                  placeholder="Add your review notes here..."
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
              <button
                onClick={() => handleReject(selectedRequest.id)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
