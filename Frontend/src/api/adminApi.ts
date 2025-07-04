
import axiosInstance from "./axiosInstance";

export const assignUserRole = async (userId: string, role: string) => {
  try {
    const response = await axiosInstance.post(`/admin/userRole/${userId}`, { role });
    return response.data;
  } catch (error: any) {
    console.error("Error assigning role:", error);
    throw error.response?.data || { error: "Server error while assigning role" };
  }
};


// fetch all users with their roles

export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`/user`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error.response?.data || { error: "Server error while fetching users" };
  }
};
