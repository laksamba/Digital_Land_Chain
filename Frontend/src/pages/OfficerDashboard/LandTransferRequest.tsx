import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, UserCheck, CheckCircle, ArrowRightLeft } from "lucide-react";
import { ethers } from "ethers";

import { ContractAbi } from "../../contractUtils/Blockchain";
const CONTRACT_ADDRESS = "0x3482740C57292B4b5FDae9D8F0dbfF633951ed9F";

interface Transfer {
  landId: string;
  from: string;
  to: string;
  approved: boolean;
}

export default function TransferRequests() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  // Changed loading to an object to track loading state per landId
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const fetchTransfers = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected!");
        return;
      }

      const provider = new ethers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/0669ecc7ed4e49b9abf49c9dd40076cf"
      );
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, provider);

      const filter = contract.filters.TransferInitiated();
      const events = await contract.queryFilter(filter, 0, "latest");

      // Deduplicate and fetch states in parallel
      const uniqueLandIds = Array.from(
        new Set(
          events
            .filter((e): e is ethers.EventLog => "args" in e && !!e.args)
            .map((e) => (e as ethers.EventLog).args.landId.toString())
        )
      );
      const transferPromises = uniqueLandIds.map(async (landId) => {
        const data = await contract.transfers(landId);
        if (data.landId.toString() !== "0") {
          return {
            landId,
            from: data.from,
            to: data.to,
            approved: data.approved,
          } as Transfer;
        }
        return null;
      });

      const results = (await Promise.all(transferPromises)).filter(Boolean) as Transfer[];
      setTransfers(results);
    } catch (err: any) {
      console.error(err);
      toast.error("Error fetching transfers");
    }
  };

  const approveTransfer = async (landId: string) => {
    try {
      // Set loading to true for this specific landId
      setLoading((prev) => ({ ...prev, [landId]: true }));
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, signer);

      // Do NOT manually pass nonce; let MetaMask handle it
      const tx = await contract.approveTransfer(landId);
      await tx.wait();

      toast.success("Transfer approved successfully!");
      fetchTransfers();
    } catch (err: any) {
      console.error(err);
      toast.error("Error approving transfer");
    } finally {
      // Reset loading for this specific landId
      setLoading((prev) => ({ ...prev, [landId]: false }));
    }
  };

  const finalizeTransfer = async (landId: string) => {
    try {
      // Set loading to true for this specific landId
      setLoading((prev) => ({ ...prev, [landId]: true }));
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, signer);

      // Do NOT manually pass nonce; let MetaMask handle it
      const tx = await contract.finalizeTransfer(landId);
      await tx.wait();

      toast.success("Transfer finalized successfully!");
      fetchTransfers();
    } catch (err: any) {
      console.error(err);
      toast.error("Error finalizing transfer");
    } finally {
      // Reset loading for this specific landId
      setLoading((prev) => ({ ...prev, [landId]: false }));
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
        <ArrowRightLeft className="w-5 h-5 text-blue-500" />
        Land Transfer Manager
      </h2>

      {transfers.length === 0 ? (
        <p className="text-gray-500 mt-4">No pending transfer requests.</p>
      ) : (
        transfers.map((t) => (
          <div key={t.landId} className="p-5 bg-white rounded-xl shadow space-y-2">
            <p><strong>Land ID:</strong> {t.landId}</p>
            <p><strong>From:</strong> {t.from}</p>
            <p><strong>To:</strong> {t.to}</p>
            <p>
              <strong>Status:</strong>{" "}
              {t.approved ? (
                <span className="text-green-600 font-medium">Approved ✅</span>
              ) : (
                <span className="text-yellow-600 font-medium">Pending ⏳</span>
              )}
            </p>

            <div className="flex gap-3 mt-3">
              {!t.approved && (
                <button
                  // Use loading state specific to this landId
                  disabled={loading[t.landId] || false}
                  onClick={() => approveTransfer(t.landId)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading[t.landId] ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  Approve
                </button>
              )}
              {t.approved && (
                <button
                  // Use loading state specific to this landId
                  disabled={loading[t.landId] || false}
                  onClick={() => finalizeTransfer(t.landId)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  {loading[t.landId] ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Finalize
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}