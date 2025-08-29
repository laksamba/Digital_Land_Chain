import axiosInstance from "./axiosInstance";

export const approveLand = async (landId: string, requestId: string) => {
  try {
    const response = await axiosInstance.put(`/land/approve/${landId}`, {
      status: "approved",
      requestId: requestId,
    });
    return response.data;
  } catch (error) {
    console.error("Error approving land:", error);
    throw error;
  }
};


export const rejectLand = async (landId: string) => {
  try {
    const response = await axiosInstance.put(`/land/reject/${landId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting land:", error);
    throw error;
  }
}

export const getAllLandsWithOwners = async () => {
  try {
    const response = await axiosInstance.get("/land");
    return response.data;
  } catch (error) {
    console.error("Error fetching lands with owners:", error);
    throw error;
  }
}

export const landTransferRequest = async (landId: string, toAddress: string, txHash: any) => {
  try {
    const response = await axiosInstance.post("/transfer/initiate", {
      landId,
      toAddress,
      txHash
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating land transfer:", error);
    throw error;
  }
}


export const approveLandTransfer = async (landId: string, requestId: string) => {
  try {
    const response = await axiosInstance.put(`/transfer/approve/${landId}`, {
      requestId: requestId,
    });
    return response.data;
  } catch (error) {
    console.error("Error approving land transfer:", error);
    throw error;
  }
}

export const getAllTransfers = async () => {
  try {
    const response = await axiosInstance.get("/transfer/pending");
    return Array.isArray(response.data) ? response.data : []; // ensure always an array
  } catch (error) {
    console.error("Error fetching pending transfers:", error);
    throw error;
  }
};

export const getUserPendingLand = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`/PendingTransfer`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching transfer history:", error.response?.data || error.message);
    throw error;
  }
};


export const downloadOwnershipPDF = async (landId: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(`/land/${landId}/pdf`, {
      responseType: 'blob', // Important for binary data
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading ownership PDF:", error);
    throw error;
  }
}

export const finalizeLandTransfer = async (landId:string,txHash:string,fromWallet:string) => {
  try {
    const response = await axiosInstance.post(`/transfer/finalize`,{landId,txHash,fromWallet});
    return response.data;
  } catch (error) {
    console.error("Error finalizing land transfer:", error);
  }
}


