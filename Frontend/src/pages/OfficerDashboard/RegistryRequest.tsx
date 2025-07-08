"use client"

import { useState } from "react"
import { Search, Eye, Check, X, MapPin } from "lucide-react"

const registryRequests = [
  {
    id: "REG001",
    applicant: "Alice Johnson",
    property: "New Plot 789, Sector D",
    type: "New Registration",
    area: "2.5 acres",
    location: "Sector D, Block 12",
    date: "2024-01-16",
    status: "pending",
    surveyComplete: true,
    documentsSubmitted: 8,
  },
  {
    id: "REG002",
    applicant: "Bob Wilson",
    property: "Commercial Plot 101",
    type: "Commercial Registration",
    area: "1.2 acres",
    location: "Commercial Zone A",
    date: "2024-01-15",
    status: "under_review",
    surveyComplete: false,
    documentsSubmitted: 6,
  },
  {
    id: "REG003",
    applicant: "Carol Davis",
    property: "Residential House 202",
    type: "Transfer Registration",
    area: "0.8 acres",
    location: "Residential Block C",
    date: "2024-01-14",
    status: "approved",
    surveyComplete: true,
    documentsSubmitted: 10,
  },
]

export function RegistryRequests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending Review</span>
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
    console.log("Approving registry request:", id)
    setShowModal(false)
  }

  const handleReject = (id: string) => {
    console.log("Rejecting registry request:", id)
    setShowModal(false)
  }

  const openModal = (request: any) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Land Registry Requests</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search registry requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-sm text-gray-600">Pending Requests</p>
          <p className="text-xs text-gray-500">Awaiting review</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">8</div>
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-xs text-gray-500">Being processed</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">5</div>
          <p className="text-sm text-gray-600">Approved Today</p>
          <p className="text-xs text-gray-500">Completed registrations</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Registry Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registryRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.applicant}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.area}</td>
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Registry Request Details - {selectedRequest.id}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Applicant</label>
                  <p className="text-sm text-gray-900">{selectedRequest.applicant}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Registration Type</label>
                  <p className="text-sm text-gray-900">{selectedRequest.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Property</label>
                  <p className="text-sm text-gray-900">{selectedRequest.property}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Area</label>
                  <p className="text-sm text-gray-900">{selectedRequest.area}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <p className="text-sm text-gray-900">{selectedRequest.location}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Survey Status</label>
                  <p className="text-sm text-gray-900">
                    {selectedRequest.surveyComplete ? "✅ Complete" : "⏳ Pending"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Documents Submitted</label>
                <p className="text-sm text-gray-900">{selectedRequest.documentsSubmitted} files uploaded</p>
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
                Approve Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
