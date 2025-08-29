import React, { useState, type FormEvent } from 'react';
import { MapPin, Ruler, FileText, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerLand } from '../../../api/userApi';
import { ethers } from 'ethers';
import { ContractAbi, CONTRACT_ADDRESS } from '../../../contractUtils/Blockchain';

interface FormData {
  location: string;
  area: string;
  landId: string;
}

const LandRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ location: '', area: '', landId: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).filter(file =>
      ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    );
    if (files.length + selectedFiles.length > 5) {
      toast.error("You can only upload max 5 files.");
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.area || !formData.landId) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!window.ethereum) {
      toast.error("MetaMask is required!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Connect wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 2️⃣ Prepare metadata hash
      const metadata = { ...formData };
      const landHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));

      // 3️⃣ Submit to blockchain via MetaMask
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, signer);
      const tx = await contract.submitRegistrationRequest(landHash);
      const receipt = await tx.wait();

      // 4️⃣ Extract requestId from event
      const event = receipt.logs
        .map((log: { topics: ReadonlyArray<string>; data: string; }) => contract.interface.parseLog(log))
        .find((e: { name: string; }) => e?.name === 'RegistrationRequested');
      const requestId = event?.args.requestId.toString();

      if (!requestId) throw new Error("Request ID not generated on-chain");

      // 5️⃣ Send metadata + requestId + transaction hash + files to backend
      const data = new FormData();
      data.append('location', formData.location);
      data.append('area', formData.area);
      data.append('landId', formData.landId);
      data.append('requestId', requestId);
      data.append('txHash', tx.hash);
      files.forEach(file => data.append('tempDocuments', file));

      const response = await registerLand(data);

      toast.success(response.message || "Land registration submitted!");
      setFormData({ location: '', area: '', landId: '' });
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Submission failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Land Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          {/* Area */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Area (sq ft)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter area"
                required
              />
            </div>
          </div>

          {/* Land ID */}
          <div>
            <label htmlFor="landId" className="block text-sm font-medium text-gray-700 mb-1">
              Plot Number
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="landId"
                name="landId"
                value={formData.landId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter plot number"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Documents (ownership certificate, tax receipts, etc.)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Select PDF, JPEG, or PNG files'}
                </span>
                <span className="text-xs text-gray-400">Maximum 5 files</span>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected Files:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative bg-gray-50 p-2 rounded-md">
                    {file.type.startsWith('image/') ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate max-w-[80%]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandRegistrationForm;