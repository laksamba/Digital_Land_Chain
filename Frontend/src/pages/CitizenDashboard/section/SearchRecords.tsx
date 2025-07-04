
import { useState } from "react"
import { Search } from "lucide-react"

export function SearchRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Search Land Records</h2>
        <p className="text-gray-600">Search public land registry database</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Criteria</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="plot-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Plot Number
                </label>
                <input
                  id="plot-search"
                  type="text"
                  placeholder="Enter plot number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="location-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  id="location-search"
                  type="text"
                  placeholder="Enter location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Search className="h-4 w-4" />
              Search Records
            </button>
          </div>
        </div>
      </div>

      {(searchQuery || locationQuery) && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h3>
            <p className="text-gray-600">No public records found for "{searchQuery || locationQuery}"</p>
          </div>
        </div>
      )}
    </div>
  )
}
