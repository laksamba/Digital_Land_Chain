"use client"

import { useState } from "react"
import { Search, Edit, MapPin, Calendar, User } from "lucide-react"

const landRecords = [
  {
    id: "LAND001",
    property: "Plot 123, Sector A",
    owner: "John Doe",
    area: "2.5 acres",
    type: "Residential",
    registrationDate: "2020-03-15",
    lastUpdated: "2024-01-10",
    coordinates: "12.9716° N, 77.5946° E",
    status: "active",
    taxStatus: "paid",
  },
  {
    id: "LAND002",
    property: "House 456, Block B",
    owner: "Jane Smith",
    area: "1.8 acres",
    type: "Commercial",
    registrationDate: "2019-07-22",
    lastUpdated: "2024-01-08",
    coordinates: "12.9720° N, 77.5950° E",
    status: "active",
    taxStatus: "pending",
  },
  {
    id: "LAND003",
    property: "Land 789, Zone C",
    owner: "Mike Johnson",
    area: "5.2 acres",
    type: "Agricultural",
    registrationDate: "2021-11-30",
    lastUpdated: "2023-12-15",
    coordinates: "12.9725° N, 77.5955° E",
    status: "under_review",
    taxStatus: "paid",
  },
]

export function LandRegistry() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
      case "under_review":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Under Review</span>
      case "inactive":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactive</span>
      case "disputed":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Disputed</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
    }
  }

  const getTaxStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
      case "overdue":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Overdue</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
    }
  }

  const handleEditRecord = (id: string) => {
    console.log("Editing record:", id)
    setShowModal(false)
  }

  const openModal = (record: any) => {
    setSelectedRecord(record)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Land Registry Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search land records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">1,247</div>
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-xs text-gray-500">Registered properties</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">1,198</div>
          <p className="text-sm text-gray-600">Active Properties</p>
          <p className="text-xs text-gray-500">Currently active</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">32</div>
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-xs text-gray-500">Pending updates</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">94%</div>
          <p className="text-sm text-gray-600">Tax Compliance</p>
          <p className="text-xs text-gray-500">Properties tax paid</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Land Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {landRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.owner}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.area}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{getTaxStatusBadge(record.taxStatus)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(record)}
                      className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Land Record Details - {selectedRecord.id}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Property</label>
                  <input
                    value={selectedRecord.property}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Owner</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    <input
                      value={selectedRecord.owner}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Area</label>
                  <input
                    value={selectedRecord.area}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Property Type</label>
                  <input
                    value={selectedRecord.type}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Registration Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <input
                      value={selectedRecord.registrationDate}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <input
                    value={selectedRecord.lastUpdated}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">GPS Coordinates</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  <input
                    value={selectedRecord.coordinates}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                onClick={() => handleEditRecord(selectedRecord.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
