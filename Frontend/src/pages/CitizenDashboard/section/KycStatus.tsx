
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

const kycProgress = 75

const kycSteps = [
  {
    id: "personal",
    title: "Personal Information",
    status: "completed",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: "identity",
    title: "Identity Documents",
    status: "completed",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: "address",
    title: "Address Verification",
    status: "in-review",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "biometric",
    title: "Biometric Verification",
    status: "pending",
    icon: AlertCircle,
    color: "text-gray-400",
  },
]

export function KYCStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">KYC Status</h2>
        <p className="text-gray-600">Your identity verification progress</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Verification Progress</h3>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">{kycProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${kycProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {kycSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <step.icon className={`h-5 w-5 ${step.color}`} />
                <span className="text-sm flex-1 text-gray-700">{step.title}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    step.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : step.status === "in-review"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {step.status === "completed" ? "Completed" : step.status === "in-review" ? "In Review" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
