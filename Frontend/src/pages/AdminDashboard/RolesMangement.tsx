
import { useState } from "react"
import {
  Shield,
  Building2,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Search,
} from "lucide-react"

interface AssignmentResponse {
  message: string
  txHash?: string
  user: {
    _id: string
    name: string
    email: string
    walletAddress?: string
    role: string
  }
  error?: string
}

const ROLES = [
  { value: "land_officer", label: "Land Officer", icon: MapPin, color: "bg-blue-500", requiresBlockchain: true },
  { value: "bank", label: "Bank", icon: Building2, color: "bg-green-500", requiresBlockchain: false },
  { value: "survey_officer", label: "Survey Officer", icon: Shield, color: "bg-purple-500", requiresBlockchain: false },
  { value: "citizen", label: "Citizen", icon: Users, color: "bg-gray-500", requiresBlockchain: false },
]

export default function AdminRoleAssignment() {
  const [userId, setUserId] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<AssignmentResponse | null>(null)
  const [error, setError] = useState("")

  // Mock user search - in real app, this would be an API call
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    {
      _id: string
      name: string
      email: string
      walletAddress?: string
      role: string
    }[]
  >([])
  const [selectedUser, setSelectedUser] = useState<{
    _id: string
    name: string
    email: string
    walletAddress?: string
    role: string
  } | null>(null)

  const mockUsers = [
    { _id: "1", name: "John Doe", email: "john@example.com", walletAddress: "0x1234...5678", role: "citizen" },
    { _id: "2", name: "Jane Smith", email: "jane@example.com", walletAddress: "0xabcd...efgh", role: "bank" },
    { _id: "3", name: "Bob Wilson", email: "bob@example.com", walletAddress: "", role: "citizen" },
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const selectUser = (user: {
    _id: string
    name: string
    email: string
    walletAddress?: string
    role: string
  }) => {
    setSelectedUser(user)
    setUserId(user._id)
    setSearchResults([])
    setSearchQuery("")
    setResponse(null)
    setError("")
  }

  const assignRole = async () => {
    if (!userId || !selectedRole) {
      setError("Please select a user and role")
      return
    }

    setLoading(true)
    setError("")
    setResponse(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response based on role type
      const roleConfig = ROLES.find((r) => r.value === selectedRole)
      const mockResponse: AssignmentResponse = {
        message: roleConfig?.requiresBlockchain
          ? "Role updated in DB and smart contract"
          : `Role '${selectedRole}' assigned in database only (no blockchain interaction)`,
        user: { ...selectedUser!, role: selectedRole },
        ...(roleConfig?.requiresBlockchain && { txHash: "0x1234567890abcdef..." }),
      }

      setResponse(mockResponse)
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, role: selectedRole })
      }
    } catch (err) {
      setError("Failed to assign role. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (roleValue: string) => {
    const role = ROLES.find((r) => r.value === roleValue)
    return role ? role.icon : Users
  }

  const getRoleColor = (roleValue: string) => {
    const role = ROLES.find((r) => r.value === roleValue)
    return role ? role.color : "bg-gray-500"
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Role Assignment</h1>
        <p className="text-gray-600 mt-2">Assign roles to users with blockchain support</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Selection */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Select User</h2>
            </div>
            <p className="text-sm text-gray-600">Search and select a user to assign a role</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => selectUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full border">
                        {user.role}
                      </span>
                    </div>
                    {user.walletAddress && <p className="text-xs text-gray-500 mt-1">Wallet: {user.walletAddress}</p>}
                  </div>
                ))}
              </div>
            )}

            {selectedUser && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${getRoleColor(selectedUser.role)} flex items-center justify-center`}
                  >
                    {(() => {
                      const IconComponent = getRoleIcon(selectedUser.role)
                      return <IconComponent className="w-5 h-5 text-white" />
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    <p className="text-xs text-gray-500">Current role: {selectedUser.role}</p>
                  </div>
                </div>
                {selectedUser.walletAddress ? (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Wallet connected: {selectedUser.walletAddress}
                  </p>
                ) : (
                  <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    No wallet address (blockchain roles unavailable)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Role Assignment */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Assign Role</h2>
            </div>
            <p className="text-sm text-gray-600">Select a role to assign to the user</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select a role</option>
                {ROLES.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                    disabled={role.requiresBlockchain && !selectedUser?.walletAddress}
                  >
                    {role.label} {role.requiresBlockchain ? "(Blockchain)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedRole && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const role = ROLES.find((r) => r.value === selectedRole)
                    const IconComponent = role?.icon || Users
                    return <IconComponent className="w-4 h-4 text-gray-700" />
                  })()}
                  <span className="font-medium text-gray-900">
                    {ROLES.find((r) => r.value === selectedRole)?.label}
                  </span>
                  {ROLES.find((r) => r.value === selectedRole)?.requiresBlockchain && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Blockchain
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {ROLES.find((r) => r.value === selectedRole)?.requiresBlockchain
                    ? "This role requires blockchain interaction and will be recorded on-chain."
                    : "This role will be stored in the database only."}
                </p>
              </div>
            )}

            <button
              onClick={assignRole}
              disabled={!selectedUser || !selectedRole || loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assigning Role...
                </>
              ) : (
                "Assign Role"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {(response || error) && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {response ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">Assignment Result</h2>
            </div>
          </div>
          <div className="p-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-green-800">{response.message}</p>
                  </div>
                </div>

                {response.txHash && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">Blockchain Transaction</p>
                        <p className="text-sm text-blue-700">Transaction Hash:</p>
                        <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-1 inline-block text-blue-800">
                          {response.txHash}
                        </code>
                      </div>
                      <button className="px-3 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </button>
                    </div>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div>
                  <p className="font-medium mb-2 text-gray-900">Updated User Information:</p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${getRoleColor(response.user.role)} flex items-center justify-center`}
                      >
                        {(() => {
                          const IconComponent = getRoleIcon(response.user.role)
                          return <IconComponent className="w-4 h-4 text-white" />
                        })()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{response.user.name}</p>
                        <p className="text-sm text-gray-600">Role: {response.user.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
