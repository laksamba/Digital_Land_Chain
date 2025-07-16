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

export const landTransferRequest = async (landId: string, toAddress: string) => {
  try {
    const response = await axiosInstance.post("/transfer/initiate", {
      landId,
      toAddress,
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating land transfer:", error);
    throw error;
  }
}



