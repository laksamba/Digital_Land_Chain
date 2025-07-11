import React, { useState, type FormEvent } from 'react';
import { MapPin, Ruler, FileText, Upload, Loader2 } from 'lucide-react';
import { registerLand } from '../../../api/userApi';

interface FormData {
  location: string;
  area: string;
  landId: string;
}

const LandRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    area: '',
    landId: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('location', formData.location);
    data.append('area', formData.area);
    data.append('landId', formData.landId);
    files.forEach((file) => data.append('tempDocuments', file));

    try {
      const response = await registerLand(data);
      setSuccess(response.message);
      setFormData({ location: '', area: '', landId: '' });
      setFiles([]);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.error || 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-lg border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 tracking-tight">Register Your Land</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300 shadow">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-300 shadow">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              required
            />
          </div>

          {/* Area */}
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Area (e.g., 100 sqm)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              required
            />
          </div>

          {/* Land ID */}
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              name="landId"
              value={formData.landId}
              onChange={handleInputChange}
              placeholder="Plot No"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Documents</label>
            <label className="flex flex-col items-center justify-center w-full px-6 py-5 bg-white border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition duration-200">
              <Upload className="w-8 h-8 text-blue-600" />
              <span className="mt-2 text-sm text-blue-700 font-medium">
                {files.length > 0 ? `${files.length} file(s) selected` : "Select PDF, DOCX, or Images"}
              </span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 font-semibold text-lg shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandRegistrationForm;
