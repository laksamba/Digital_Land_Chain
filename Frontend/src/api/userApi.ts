import axiosInstance from "./axiosInstance";

// userRegistration API call
export const registerUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; 
  }
};

// userLogin API call
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error logging user:", error);
    throw error; 
  }
};


// userkyc 
export const userKyc = async (kycData: FormData) => {
  try {
    const response = await axiosInstance.post("/kyc", kycData); // ✅ No custom headers here
    return response.data;
  } catch (error) {
    console.error("Error submitting KYC:", error);
    throw error;
  }
};


// userkyc 
export const verifyKyc = async (kycData: any) => {
  try {
    const response = await axiosInstance.post("/kyc/verify", kycData);
    return response.data;
  } catch (error) {
    console.error("Error submitting KYC:", error);
    throw error; 
  }
}
