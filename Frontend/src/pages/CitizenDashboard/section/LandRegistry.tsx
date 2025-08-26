import React, { useState, type FormEvent } from 'react';
import { MapPin, Ruler, FileText, Upload } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white/95 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full border border-blue-200">
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-8 tracking-tight">Register Your Land</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="relative group">
            <label htmlFor="location">Location</label>
            <MapPin className="absolute left-3 top-10" size={20} />
            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
          </div>

          {/* Area */}
          <div className="relative group">
            <label htmlFor="area">Area</label>
            <Ruler className="absolute left-3 top-10" size={20} />
            <input type="text" id="area" name="area" value={formData.area} onChange={handleInputChange} required />
          </div>

          {/* Land ID */}
          <div className="relative group">
            <label htmlFor="landId">Plot Number</label>
            <FileText className="absolute left-3 top-10" size={20} />
            <input type="text" id="landId" name="landId" value={formData.landId} onChange={handleInputChange} required />
          </div>

          {/* File Upload */}
          <div>
            <label>Upload documents</label>
            <label className="flex flex-col items-center justify-center w-full px-6 py-6 border-2 border-dashed cursor-pointer">
              <Upload className="w-10 h-10 text-blue-600" />
              <span>{files.length > 0 ? `${files.length} files selected` : "Select PDF, JPEG, PNG"}</span>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {files.length > 0 && (
            <div>
              {files.map((file, index) => (
                <div key={index}>
                  {file.name} <button type="button" onClick={() => removeFile(index)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandRegistrationForm;
