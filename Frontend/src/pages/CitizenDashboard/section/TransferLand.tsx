import  { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { landTransferRequest } from '../../../api/LandApi';

const LandTransferForm = () => {
  const [formData, setFormData] = useState({
    landId: '',
    toAddress: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.landId || !formData.toAddress) {
      toast.error('Please fill in all fields', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    // Validate Ethereum address format (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.toAddress)) {
      toast.error('Invalid recipient wallet address', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
  const response = await landTransferRequest(formData.landId, formData.toAddress);
  const data = response.data;

  if (response.status === 200) {
    toast.success(`Transfer initiated! Tx: ${data.txHash}`, {
      position: 'top-right',
      autoClose: 5000,
    });
    setFormData({ landId: '', toAddress: '' });
  } else {
    toast.error(data.message || 'Transfer initiation failed', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
} catch (error: any) {
  let errorMessage = 'An unexpected error occurred';

  if (error.response && error.response.data) {
    errorMessage = error.response.data.message || error.response.data.error || errorMessage;
  } else if (error.message) {
    errorMessage = error.message;
  }

  toast.error('Error: ' + errorMessage, {
    position: 'top-right',
    autoClose: 3000,
  });
}
 finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Send className="mr-2" /> Initiate Land Transfer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="landId" className="block text-sm font-medium text-gray-700">
              Land ID
            </label>
            <input
              type="text"
              id="landId"
              name="landId"
              value={formData.landId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter Land ID"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700">
              Recipient Wallet Address
            </label>
            <input
              type="text"
              id="toAddress"
              name="toAddress"
              value={formData.toAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter recipient address (0x...)"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2" size={20} />
                Initiate Transfer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandTransferForm;