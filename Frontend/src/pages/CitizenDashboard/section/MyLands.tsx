
import { MapPin, Eye, Download } from "lucide-react"

interface LandRecord {
  id: string
  plotNo: string
  location: string
  size: string
  type: string
  status: string
  registrationDate: string
}

const myLands: LandRecord[] = [
  {
    id: "1",
    plotNo: "PLT-2024-001",
    location: "Sector 15, Block A, New Delhi",
    size: "500 sq ft",
    type: "Residential",
    status: "Verified",
    registrationDate: "2024-01-15",
  },
  {
    id: "2",
    plotNo: "PLT-2024-002",
    location: "Industrial Area, Gurgaon",
    size: "1200 sq ft",
    type: "Commercial",
    status: "Verified",
    registrationDate: "2024-02-20",
  },
]

export function MyLands() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">My Lands</h2>
        <p className="text-gray-600">View and manage your land properties</p>
      </div>

      <div className="grid gap-4">
        {myLands.map((land) => (
          <div
            key={land.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{land.plotNo}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    land.status === "Verified" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {land.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{land.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Size</p>
                  <p className="text-sm font-medium text-gray-900">{land.size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{land.type}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
