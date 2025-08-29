// frontend/src/components/LandForm.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import { UploadCloud } from 'lucide-react';
import axios from 'axios';

const FileUpload: React.FC = () => {
  const [landId, setLandId] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [doc1, setDoc1] = useState<File | null>(null);
  const [doc2, setDoc2] = useState<File | null>(null);
  const [doc3, setDoc3] = useState<File | null>(null);
  const [doc4, setDoc4] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const documents = [
  { key: 'doc1', label: 'Certificated of resident' },
  { key: 'doc2', label: 'Roka Fuka ko Document' },
  { key: 'doc3', label: 'Tax Clearance' },
  { key: 'doc4', label: 'Ownership Certificate' },
];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!landId || !ownerName) {
      toast.error('Land ID and Owner Name are required');
      return;
    }

    const formData = new FormData();
    formData.append('landId', landId);
    formData.append('ownerName', ownerName);
    if (doc1) formData.append('doc1', doc1);
    if (doc2) formData.append('doc2', doc2);
    if (doc3) formData.append('doc3', doc3);
    if (doc4) formData.append('doc4', doc4);

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/transfer/docsUpload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Documents record saved successfully');
      setLandId('');
      setOwnerName('');
      setDoc1(null);
      setDoc2(null);
      setDoc3(null);
      setDoc4(null);
    } catch (error) {
      toast.error('Error saving land record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Lands Transfer documents </h2>
        <p className='text-red-500'>Note : Please upload the real documents to get approval!</p>
        
        <div className="mb-4">
          <label htmlFor="landId" className="block text-sm font-medium text-gray-700">Land ID</label>
          <input
            type="text"
            id="landId"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Owner Name</label>
          <input
            type="text"
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
       {documents.map(({ key, label }) => (
  <div key={key} className="mb-4">
    <label htmlFor={key} className="text-sm font-medium text-gray-700 flex items-center">
      <UploadCloud className="mr-2 h-4 w-4" />
      Upload {label}
    </label>
    <input
      type="file"
      id={key}
      onChange={(e) =>
        handleFileChange(
          e,
          eval(`set${key.charAt(0).toUpperCase() + key.slice(1)}` as any)
        )
      }
      className="mt-1 block w-full text-sm text-gray-900 bg-transparent border-0 focus:outline-none"
    />
  </div>
))}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Saving...' : 'Subbmit'}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </div>
  );
};

export default FileUpload;