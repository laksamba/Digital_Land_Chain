"use client";

import { useState, useEffect } from "react";
import { FileText, Eye, Check, X } from "lucide-react";
import { fetchKycList, verifyKyc } from "../../api/userApi";

type KycDocument = {
  name: string;
  type: string;
  status: string;
  url: string;
};

type KycItem = {
  id: string;
  userId: string;
  citizen: string;
  nepaliName: string;
  property: string;
  photo: string;
  documents: KycDocument[];
  submittedDate: string;
  status: string;
  name: string;
  email: string;
  walletAddress: string;
  citizenshipNumber: string;
 citizenshipIssuedDate: {
    bs: string;
    ad: string;
  };
  dateOfBirth: {
    bs: string;
    ad: string;
  };
};

export function KYCReview() {
  const [kycList, setKycList] = useState<KycItem[]>([]);
  const [selectedKYC, setSelectedKYC] = useState<KycItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadKycData = async () => {
      setFetchLoading(true);
      try {
        const data = await fetchKycList();

        const mapped = data.map((item: any) => ({
          id: item.id,
          userId: item.userId,
          citizen: item.kyc.fullName.english,
          nepaliName: item.kyc.fullName.nepali,
          property: item.kyc.citizenshipIssuedDistrict,
          photo: item.kyc.photo,
          documents: item.kyc.documents || [],
          submittedDate: item.kyc.createdAt,
          status: item.kyc.verificationStatus,

          name: item.name,
          email: item.email,
          walletAddress: item.walletAddress,
          citizenshipNumber: item.kyc.citizenshipNumber,
          citizenshipIssuedDate: item.kyc.citizenshipIssuedDate,
          dateOfBirth: item.kyc.dateOfBirth,
        }));

        setKycList(mapped);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch KYC data.");
      } finally {
        setFetchLoading(false);
      }
    };

    loadKycData();
  }, []);

  const openModal = (kyc: KycItem) => {
    setSelectedKYC(kyc);
    setShowModal(true);
    setError("");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <Check className="h-3 w-3" />
            Verified
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            <Eye className="h-3 w-3" />
            Under Review
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <X className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
        );
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Verified</span>;
      case "under_review":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Review</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  const handleKycAction = async (status: "Verified" | "Rejected") => {
    if (!selectedKYC) return;

    setLoading(true);
    setError("");

    try {
      await verifyKyc({
        userId: selectedKYC.userId,
        status,
        verified: status === "Verified",
      });

      const updatedList = kycList.map((kyc) =>
        kyc.id === selectedKYC.id ? { ...kyc, status: status.toLowerCase() } : kyc
      );

      setKycList(updatedList);
      setShowModal(false);
      setSelectedKYC(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">KYC Document Review</h2>

      {fetchLoading ? (
        <div className="text-center py-4">Loading KYC data...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : kycList.length === 0 ? (
        <div className="text-center py-4">No KYC data available.</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Document Verification Queue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citizen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kycList.map((kyc) => (
                  <tr key={kyc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{kyc.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{kyc.citizen}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{kyc.property}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{kyc.documents.length} files</td>
                    <td className="px-4 py-4">{getStatusBadge(kyc.status)}</td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        onClick={() => openModal(kyc)}
                        className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
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
      )}

      {/* Modal */}
      {showModal && selectedKYC && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                KYC Document Review - {selectedKYC.id}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Citizen Photo</label>
                {selectedKYC.photo ? (
                  <img
                    src={selectedKYC.photo}
                    alt="Citizen Photo"
                    className="w-32 h-32 object-cover rounded-md border border-gray-200"
                    onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
                  />
                ) : (
                  <p className="text-sm text-gray-500">No photo available</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Citizen Name (English)</label>
                  <p className="text-sm text-gray-900">{selectedKYC.citizen}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Citizen Name (Nepali)</label>
                  <p className="text-sm text-gray-900">{selectedKYC.nepaliName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedKYC.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Wallet Address</label>
                  <p className="text-sm text-gray-900">{selectedKYC.walletAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Citizenship Number</label>
                  <p className="text-sm text-gray-900">{selectedKYC.citizenshipNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Issued District</label>
                  <p className="text-sm text-gray-900">{selectedKYC.property}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Issued Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedKYC.citizenshipIssuedDate.bs).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedKYC.dateOfBirth.bs).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted On</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedKYC.submittedDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Submitted Documents</label>
                <div className="space-y-2">
                  {selectedKYC.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatusBadge(doc.status)}
                        <button
                          onClick={() => setSelectedDocument(doc.url)}
                          className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleKycAction("Rejected")}
                className="inline-flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                <X className="h-4 w-4" />
                Reject KYC
              </button>
              <button
                disabled={loading}
                onClick={() => handleKycAction("Verified")}
                className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                Approve KYC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900">Document Preview</h4>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedDocument}
                alt="Document Preview"
                className="w-full max-h-[60vh] object-contain"
                onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
