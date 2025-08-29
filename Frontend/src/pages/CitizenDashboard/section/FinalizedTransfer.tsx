import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Loader2, CheckCircle } from "lucide-react";
import { finalizeLandTransfer } from "../../../api/LandApi";
import { ContractAbi } from "../../../contractUtils/Blockchain";

const CONTRACT_ADDRESS = "0x3482740C57292B4b5FDae9D8F0dbfF633951ed9F";

interface Transfer {
  landId: string;
  from: string;
  to: string;
  status: "initiated" | "finalized";
}

export default function FinalizedTransfer() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setCurrentUser(userAddress);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, provider);

        const filter = contract.filters.TransferInitiated();
        const events = await contract.queryFilter(filter);

        const allTransfers = await Promise.all(
          events.map(async (e: any) => {
            const landId = e.args.landId.toString();
            const from = e.args.from;
            const to = e.args.to;

            let status: "initiated" | "finalized" = "initiated";
            try {
              const land = await contract.lands(landId);
              if (land.owner.toLowerCase() === to.toLowerCase()) {
                status = "finalized";
              }
            } catch {
              status = "initiated";
            }

            return { landId, from, to, status };
          })
        );

        const userTransfers = allTransfers.filter(
          (t) => t.to.toLowerCase() === userAddress.toLowerCase()
        );

        const uniqueTransfers = Array.from(
          new Map(userTransfers.map((t) => [t.landId, t])).values()
        );

        setTransfers(uniqueTransfers);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching transfers");
      }
    };

    fetchTransfers();
  }, []);

  const finalizeTransfer = async (landId: string, fromWallet: string) => {
    try {
      setLoadingIds((prev) => ({ ...prev, [landId]: true }));

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, signer);

      const tx = await contract.finalizeTransfer(landId);
      const receipt = await tx.wait();
      console.log("→ Transaction receipt:", receipt);

      // Send fromWallet along with landId and txHash
    const backendResponse = await finalizeLandTransfer(landId, tx.hash, fromWallet);

      console.log("→ Backend finalize response:", backendResponse);

      toast.success(`Land ${landId} finalized!`);

      setTransfers((prev) =>
        prev.map((t) =>
          t.landId === landId ? { ...t, status: "finalized" } : t
        )
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.reason || "Error finalizing transfer");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [landId]: false }));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Land Transfers</h2>

      {transfers.length === 0 && (
        <p className="text-gray-500">No transfers found.</p>
      )}

      <ul className="space-y-3">
        {transfers.map((t) => (
          <li
            key={t.landId}
            className="flex items-center justify-between p-4 rounded-xl shadow bg-white"
          >
            <div>
              <p className="font-medium">Land ID: {t.landId}</p>
              <p className="text-sm text-gray-500">
                From: {t.from.slice(0, 6)}... To: {t.to.slice(0, 6)}...
              </p>
            </div>

            <div className="flex items-center gap-2">
              {t.status === "finalized" ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm capitalize">Finalized</span>
                </>
              ) : currentUser.toLowerCase() === t.to.toLowerCase() ? (
                <button
                  onClick={() => finalizeTransfer(t.landId, t.from)} // Pass fromWallet
                  disabled={loadingIds[t.landId]}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loadingIds[t.landId] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Finalize"
                  )}
                </button>
              ) : (
                <span className="text-gray-400 text-sm">Waiting for recipient</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}