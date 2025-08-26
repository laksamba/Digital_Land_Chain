import { useState, useEffect } from 'react';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { landTransferRequest, getUserPendingLand } from '../../../api/LandApi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ContractAbi } from '../../../contractUtils/Blockchain';

interface Transfer {
  _id: string;
  landId: string;
  fromUser?: string;
  toUser?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
}

const LandTransfer = () => {
  const [formData, setFormData] = useState({ landId: '', toAddress: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchTransfers = async () => {
    try {
      setLoadingTransfers(true);
      const data = await getUserPendingLand();
      setTransfers(data);
    } catch (err) {
      console.error('Error fetching transfers', err);
      toast.error('Failed to load transfers', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoadingTransfers(false);
    }
  };

  const initiateTransferOnChain = async (landId: string, toAddress: string) => {
    if (!window.ethereum) throw new Error('MetaMask not detected');
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, signer);

    const tx = await contract.initiateTransfer(landId, toAddress);
    await tx.wait();
    return tx.hash;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { landId, toAddress } = formData;
    if (!landId || !toAddress) {
      toast.error('Please fill in all fields', { position: 'top-right', autoClose: 3000 });
      setIsLoading(false);
      return;
    }

    const normalizedAddress = toAddress.toLowerCase();
    if (!/^0x[a-f0-9]{40}$/.test(normalizedAddress)) {
      toast.error('Invalid recipient wallet address', { position: 'top-right', autoClose: 3000 });
      setIsLoading(false);
      return;
    }

    try {
      const txHash = await initiateTransferOnChain(landId, normalizedAddress);
      const response = await landTransferRequest(landId, normalizedAddress, txHash);
      const data = response?.data || {};

      toast.success(
        data.transfer ? `Transfer initiated! Tx: ${txHash}` : 'Transfer initiated successfully!',
        { position: 'top-right', autoClose: 5000 }
      );

      setFormData({ landId: '', toAddress: '' });
      fetchTransfers();
    } catch (error: any) {
      console.error('Error details:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Unexpected error';
      toast.error('Error: ' + errorMessage, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 space-y-6">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Send className="mr-2" /> Initiate Land Transfer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="landId" className="block text-sm font-medium text-gray-700">Land ID</label>
            <input
              type="text"
              id="landId"
              name="landId"
              value={formData.landId}
              onChange={handleInputChange}
              placeholder="Enter Land ID"
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700">Recipient Wallet Address</label>
            <input
              type="text"
              id="toAddress"
              name="toAddress"
              value={formData.toAddress}
              onChange={handleInputChange}
              placeholder="Enter recipient address (0x...)"
              disabled={isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isLoading ? <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</> : <><Send className="mr-2" size={20} /> Initiate Transfer</>}
          </button>
        </form>
      </div>

      {/* Transfer Status */}
      <div className="w-full max-w-md p-6 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Land Transfer Status</h2>
          <button onClick={fetchTransfers} className="flex items-center space-x-1 text-sm text-blue-600 hover:underline">
            <RefreshCw size={16} /> <span>Refresh</span>
          </button>
        </div>

        {loadingTransfers ? (
          <p className="text-gray-600">Loading transfers...</p>
        ) : transfers.length === 0 ? (
          <p className="text-gray-600">No land transfers found for you.</p>
        ) : (
          <ul className="space-y-4">
            {transfers.map((transfer) => (
              <li key={transfer._id} className="p-4 border rounded-lg shadow-sm">
                <p><strong>Land ID:</strong> {transfer.landId}</p>
                <p><strong>From:</strong> {transfer.fromUser?.toLowerCase() || 'N/A'}</p>
                <p><strong>To:</strong> {transfer.toUser?.toLowerCase() || 'N/A'}</p>
                <p><strong>Status:</strong> <span className={
                  transfer.status === 'pending' ? 'text-yellow-500' :
                  transfer.status === 'approved' ? 'text-green-600' :
                  transfer.status === 'rejected' ? 'text-red-600' : 'text-blue-600'
                }>{transfer.status}</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LandTransfer;
