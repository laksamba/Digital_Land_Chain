"use client"

import { useEffect, useState } from "react"
import { fetchKycList } from "../../../api/userApi"
import { CheckCircle, Clock, User, Shield, Calendar } from "lucide-react"

type KycData = {
  userId: string
  name?: string
  kyc: {
    fullName?: {
      english?: string
    }
    createdAt?: string
    verified?: boolean
    verifiedAt?: string
  }
}

export function KYCStatus() {
  const [kyc, setKyc] = useState<KycData | null>(null)

  useEffect(() => {
   const getKyc = async () => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return console.warn("No user in localStorage")

      const parsedUser = JSON.parse(storedUser)
      const currentUserId = parsedUser.id
      console.log("Current User ID:", currentUserId)

      const data = await fetchKycList()
      console.log("Fetched KYC list:", data)

      const currentUserKyc = data.find((item: KycData) => item.userId === currentUserId)
      console.log("Matched User KYC:", currentUserKyc)

      setKyc(currentUserKyc || null)
    } catch (error) {
      console.error("Error fetching KYC:", error)
    }
  }

  getKyc()
  }, [])

  const isVerified = kyc?.kyc.verified === true

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        {/* Header */}
        <div
          className={`px-8 py-6 ${
            isVerified
              ? "bg-gradient-to-r from-emerald-500 to-green-600"
              : "bg-gradient-to-r from-amber-500 to-orange-600"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {isVerified ? (
                <CheckCircle className="text-white w-7 h-7" />
              ) : (
                <Clock className="text-white w-7 h-7" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {isVerified ? "Identity Verified" : "Verification Pending"}
              </h1>
              <p className="text-white/90 text-sm">
                {isVerified
                  ? "Your KYC verification has been completed successfully"
                  : "Your identity verification is currently being processed"}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Badge */}
          <div className="flex justify-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isVerified
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              <Shield className="w-4 h-4" />
              {isVerified ? "Verified Account" : "Under Review"}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">Full Name (English)</label>
                <p className="text-base text-slate-900 font-medium">
                  {kyc?.kyc.fullName?.english || "Not provided"}
                </p>
              </div>

              {kyc?.kyc.createdAt && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-600">Submitted Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <p className="text-base text-slate-900">
                      {new Date(kyc.kyc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {kyc?.kyc.verifiedAt && isVerified && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-600">Verified Date</label>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <p className="text-base text-slate-900">
                      {new Date(kyc.kyc.verifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`text-center p-4 rounded-xl ${
              isVerified
                ? "bg-emerald-50 border border-emerald-200"
                : "bg-amber-50 border border-amber-200"
            }`}
          >
            <p className={`text-sm ${isVerified ? "text-emerald-700" : "text-amber-700"}`}>
              {isVerified
                ? "Your account has full access to all features and services."
                : "We're reviewing your documents. This usually takes 1–2 business days."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
