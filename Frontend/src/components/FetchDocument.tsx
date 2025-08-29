import React, { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Land {
  _id: string;
  landId: string;
  ownerName: string;
  doc1Url?: string;
  doc2Url?: string;
  doc3Url?: string;
  doc4Url?: string;
}

const FetchDocuments: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [filteredLands, setFilteredLands] = useState<Land[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transfer/fetchDocs');
      const data = await response.json();
      if (response.ok) {
        setLands(data.data);
        setFilteredLands(data.data);
        toast.success('Land records fetched successfully');
      } else {
        toast.error(data.message || 'Failed to fetch land records');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    if (value) {
      const filtered = lands.filter((land) =>
        land.landId.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLands(filtered);
    } else {
      setFilteredLands(lands);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Land Records</h1>
      
      <div className="mb-4 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={filter}
            onChange={handleFilter}
            placeholder="Filter by Land ID"
            className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Land ID</th>
              <th className="p-3 text-left">Owner Name</th>
              <th className="p-3 text-left">Documents</th>
            </tr>
          </thead>
          <tbody>
            {filteredLands.length > 0 ? (
              filteredLands.map((land) => (
                <tr key={land._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{land.landId}</td>
                  <td className="p-3">{land.ownerName}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {land.doc1Url && (
                        <a href={land.doc1Url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                        </a>
                      )}
                      {land.doc2Url && (
                        <a href={land.doc2Url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                        </a>
                      )}
                      {land.doc3Url && (
                        <a href={land.doc3Url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                        </a>
                      )}
                      {land.doc4Url && (
                        <a href={land.doc4Url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FetchDocuments;