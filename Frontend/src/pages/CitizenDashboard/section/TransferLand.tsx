
import { useState } from "react"
import { ArrowRightLeft } from "lucide-react"

const myLands = [
  {
    id: "1",
    plotNo: "PLT-2024-001",
    location: "Sector 15, Block A, New Delhi",
  },
  {
    id: "2",
    plotNo: "PLT-2024-002",
    location: "Industrial Area, Gurgaon",
  },
]

export function TransferLand() {
  const [selectedLand, setSelectedLand] = useState("")
  const [transferTo, setTransferTo] = useState("")
  const [transferReason, setTransferReason] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Initiate Land Transfer</h2>
        <p className="text-gray-600">Transfer land ownership to another user</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Details</h3>
          <p className="text-gray-600 mb-6">Fill in the details to initiate a land transfer</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="select-land" className="block text-sm font-medium text-gray-700 mb-1">
                Select Land to Transfer
              </label>
              <select
                id="select-land"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={selectedLand}
                onChange={(e) => setSelectedLand(e.target.value)}
              >
                <option value="">Select a property</option>
                {myLands.map((land) => (
                  <option key={land.id} value={land.id}>
                    {land.plotNo} - {land.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="transfer-to" className="block text-sm font-medium text-gray-700 mb-1">
                Transfer To (User ID/Email)
              </label>
              <input
                id="transfer-to"
                type="text"
                placeholder="Enter recipient's user ID or email"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="transfer-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Transfer
              </label>
              <input
                id="transfer-reason"
                type="text"
                placeholder="Sale, Gift, Inheritance, etc."
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              disabled={!selectedLand || !transferTo}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                !selectedLand || !transferTo
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Initiate Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
