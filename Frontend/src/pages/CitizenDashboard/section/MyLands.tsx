import { useEffect, useState } from "react";
import { MapPin, Eye, Download } from "lucide-react";
import { fetchUserLands } from "../../../api/userApi";
import { downloadOwnershipPDF } from "../../../api/LandApi";

interface LandRecord {
  _id: string;
  landId: string;
  location: string;
  area: string;
  type: string;
  status: string;
  createdAt: string;
}

export function MyLands() {
  const [myLands, setMyLands] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const user = localStorage.getItem("user");
  let userId: string | undefined = undefined;
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      userId = parsedUser.id;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setError("Failed to retrieve user information.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error("User ID is missing.");
        }
        setLoading(true);
        const lands = await fetchUserLands(userId);
        if (!lands || !Array.isArray(lands)) {
          throw new Error("Invalid data format received from API.");
        }
        console.log("Fetched Lands:", lands);
        setMyLands(lands);
      } catch (err: any) {
        console.error("Error fetching lands:", err);
        setError(err.message || "Failed to fetch your land records. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // Handle PDF download
  const handleDownloadPDF = async (landId: string) => {
    try {
      const pdfBlob = await downloadOwnershipPDF(landId);
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `ownership_${landId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      setError("Failed to download the ownership certificate. Please try again.");
    }
  };

  // Filter lands based on selected status
  const filteredLands = selectedStatus === "All"
    ? myLands
    : myLands.filter((land) => land.status === selectedStatus);

  // Sidebar status options
  const statusOptions = ["All", "verified", "rejected", "pending"];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Status</h3>
        <ul className="space-y-2">
          {statusOptions.map((status) => (
            <li key={status}>
              <button
                onClick={() => setSelectedStatus(status)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status} ({status === "All" ? myLands.length : myLands.filter((land) => land.status === status).length})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">My Lands</h2>
          <p className="text-gray-600">View and manage your land properties</p>
        </div>

        {loading && <p>Loading lands...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && filteredLands.length === 0 && (
          <p className="text-gray-600">No {selectedStatus.toLowerCase()} land records found.</p>
        )}

        <div className="grid gap-4">
          {filteredLands.map((land) => (
            <div
              key={land._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{land._id}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      land.status === "verified"
                        ? "bg-green-100 text-green-800"
                        : land.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {land.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{land.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Size</p>
                    <p className="text-sm font-medium text-gray-900">{land.area}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plot No</p>
                    <p className="text-sm font-medium text-gray-900">{land.landId}</p>
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
                  <button
                    onClick={() => handleDownloadPDF(land.landId)}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </button>
                  <span className="text-sm text-gray-500">Registered on:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(land.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}