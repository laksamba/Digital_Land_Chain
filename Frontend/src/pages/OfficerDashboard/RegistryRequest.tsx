"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store";
import {
  fetchAllLands,
  approveLandById,
  rejectLandById,
} from "../../Redux/landSlice";
import { Search, Eye, Check, X, MapPin } from "lucide-react";

export function RegistryRequests() {
  const dispatch = useDispatch<AppDispatch>();
  const { lands, loading, error } = useSelector(
    (state: RootState) => state.land
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllLands());
  }, [dispatch]);

  const filteredRequests = lands.filter((req: any) => {
    const match =
      req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.area.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  const handleApprove = async (land: any) => {
    if (!land.requestId) {
      console.error("❌ Missing requestId for this land.");
      return;
    }

    setActionLoadingId(land._id);
    try {
      await dispatch(
        approveLandById({
          landId: land._id,
          requestId: land.requestId,
        })
      );
      await dispatch(fetchAllLands());
      setShowModal(false);
    } catch (error) {
      console.error("Approval error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (landId: string) => {
    setActionLoadingId(landId);
    try {
      await dispatch(rejectLandById(landId));
      await dispatch(fetchAllLands());
      setShowModal(false);
    } catch (error) {
      console.error("Rejection error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const openModal = (request: any) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Pending
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            <Eye className="h-3 w-3" /> Under Review
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <Check className="h-3 w-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <X className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Land Registry Requests
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search registry requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Registry Requests
          </h3>
        </div>
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">❌ Error: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Request ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Area
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request: any) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {request._id.slice(0, 6)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.owner?.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.location}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.area}
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(request.status)}</td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        onClick={() => openModal(request)}
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
        )}
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Details - {selectedRequest._id}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Owner
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedRequest.owner?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <p className="text-sm text-gray-900">
                      {selectedRequest.location}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedRequest.area}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="text-sm text-gray-900 capitalize">
                    {selectedRequest.status}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  IPFS Documents
                </label>
                {selectedRequest.ipfsDocuments?.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {selectedRequest.ipfsDocuments.map(
                      (hash: string, i: number) => (
                        <li key={i}>
                          <a
                            href={`https://ipfs.io/ipfs/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm break-all"
                          >
                            {hash}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No documents available
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={actionLoadingId !== null}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedRequest._id)}
                disabled={actionLoadingId === selectedRequest._id}
                className="inline-flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoadingId === selectedRequest._id ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <X className="h-4 w-4" />
                )}
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest)}
                disabled={actionLoadingId === selectedRequest._id}
                className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoadingId === selectedRequest._id ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
