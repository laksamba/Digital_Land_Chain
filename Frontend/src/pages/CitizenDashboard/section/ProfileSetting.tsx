
export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h2>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    defaultValue="John"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  defaultValue="+91 9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  defaultValue="123 Main Street, New Delhi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h3>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  JD
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Change Picture
              </button>

              <hr className="border-gray-200" />

              <div className="space-y-2">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Two-Factor Auth
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
