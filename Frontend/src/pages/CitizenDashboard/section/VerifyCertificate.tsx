
import { Shield, Eye, Download } from "lucide-react"

const myLands = [
  {
    id: "1",
    plotNo: "PLT-2024-001",
    location: "Sector 15, Block A, New Delhi",
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
  },
  {
    id: "2",
    plotNo: "PLT-2024-002",
    location: "Industrial Area, Gurgaon",
    blockchainHash: "0x9876543210fedcba0987654321abcdef",
  },
]

export function VerifyCertificate() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Verify Land Certificate</h2>
        <p className="text-gray-600">Download or verify blockchain certificates</p>
      </div>

      <div className="grid gap-4">
        {myLands.map((land) => (
          <div
            key={land.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Certificate for {land.plotNo}</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {land.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Blockchain Hash:</span> {land.blockchainHash.slice(0, 20)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Eye className="h-4 w-4" />
                    Verify
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
