import React, { useState, useEffect,type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { MapPin, FileText, Send, Loader2, User } from 'lucide-react';
import axios from 'axios';

interface SurveyFormData {
  landId: string;
  surveyDetails: string;
  surveyOfficer: string;
}

interface User {
  _id: string;
  name: string;
  role: string;
}

const DUMMY_SURVEYOR: User = {
  _id: '000000000000000000000000', // Replace with actual John Doe User _id from your database
  name: 'John Doe',
  role: 'surveyor',
};

const RequestSurveyer: React.FC = () => {
  const [formData, setFormData] = useState<SurveyFormData>({
    landId: '',
    surveyDetails: '',
    surveyOfficer: '',
  });
  const [surveyors, setSurveyors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingSurveyors, setIsFetchingSurveyors] = useState(true);

  // Fetch available surveyors
  useEffect(() => {
    const fetchSurveyors = async () => {
      try {
        setIsFetchingSurveyors(true);
        const response = await axios.get('/api/users?role=surveyor');
        // Ensure response.data is an array
        const fetchedSurveyors = Array.isArray(response.data)
          ? response.data
          : response.data?.users || [];
        // If no surveyors, use dummy surveyor
        const surveyorsToSet = fetchedSurveyors.length > 0 ? fetchedSurveyors : [DUMMY_SURVEYOR];
        setSurveyors(surveyorsToSet);
        // Set default surveyor to John Doe if none available
        if (fetchedSurveyors.length === 0) {
          setFormData((prev) => ({ ...prev, surveyOfficer: DUMMY_SURVEYOR._id }));
        }
      } catch (err) {
        console.error('Error fetching surveyors:', err);
        toast.error('Failed to load surveyors, using default surveyor');
        setSurveyors([DUMMY_SURVEYOR]);
        setFormData((prev) => ({ ...prev, surveyOfficer: DUMMY_SURVEYOR._id }));
      } finally {
        setIsFetchingSurveyors(false);
      }
    };
    fetchSurveyors();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.landId.trim()) {
      toast.error('Land ID is required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/surveys', {
        landId: formData.landId,
        surveyDetails: formData.surveyDetails || undefined,
        surveyOfficer: formData.surveyOfficer || undefined,
      });

      toast.success('Survey request submitted successfully!');
      setFormData({
        landId: '',
        surveyDetails: '',
        surveyOfficer: surveyors.length === 1 && surveyors[0]._id === DUMMY_SURVEYOR._id ? DUMMY_SURVEYOR._id : '',
      });
    } catch (err: any) {
      console.error('Error submitting survey request:', err);
      toast.error(err.response?.data?.error || 'Error submitting survey request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex items-center justify-center gap-3">
          <MapPin className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Request Land Survey
          </h2>
        </div>
        <p className="text-gray-600 text-center">
          Submit a request for a surveyor to assess your land.
        </p>

        {isFetchingSurveyors ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="landId"
                className="block text-sm font-medium text-gray-700"
              >
                Land ID
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="landId"
                  id="landId"
                  value={formData.landId}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter blockchain land ID"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="surveyOfficer"
                className="block text-sm font-medium text-gray-700"
              >
                Assign Survey Officer (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="surveyOfficer"
                  id="surveyOfficer"
                  value={formData.surveyOfficer}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={loading || surveyors.length === 1}
                >
                  {surveyors.length > 1 && (
                    <option value="">Select a surveyor</option>
                  )}
                  {Array.isArray(surveyors) && surveyors.map((surveyor) => (
                    <option key={surveyor._id} value={surveyor._id}>
                      {surveyor.name}
                    </option>
                  ))}
                </select>
              </div>
              {surveyors.length === 1 && surveyors[0]._id === DUMMY_SURVEYOR._id && (
                <p className="mt-1 text-sm text-gray-500">
                  No surveyors available, defaulting to John Doe.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="surveyDetails"
                className="block text-sm font-medium text-gray-700"
              >
                Survey Details (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  name="surveyDetails"
                  id="surveyDetails"
                  value={formData.surveyDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Provide any specific details or instructions for the surveyor"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestSurveyer;