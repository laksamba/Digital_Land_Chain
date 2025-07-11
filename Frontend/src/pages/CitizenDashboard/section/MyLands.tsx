import { useEffect, useState } from "react";
import { MapPin, Eye, Download } from "lucide-react";
import { fetchUserLands } from "../../../api/userApi";

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

  
  const user = localStorage.getItem("user");
  let userId: string | undefined = undefined;
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      userId = parsedUser.id;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }

  console.log("userId:", userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) throw new Error("User ID is missing.");
        const lands = await fetchUserLands(userId);
        console.log("Fetched Lands:", lands);
        setMyLands(lands); 
      } catch (err) {
        setError("Failed to fetch your land records.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">My Lands</h2>
        <p className="text-gray-600">View and manage your land properties</p>
      </div>

      {loading && <p>Loading lands...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && myLands.length === 0 && (
        <p className="text-gray-600">No land records found.</p>
      )}

      <div className="grid gap-4">
        {myLands.map((land) => (
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
                    land.status === "Verified"
                      ? "bg-green-100 text-green-800"
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
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
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
  );
}
