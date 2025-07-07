
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

// admin dashborad metrics
export const getDashboardMetrics = async () => {
try {
    const res = await axiosInstance.get('/admin/dashboardMetrics');
  return res.data;
} catch (error: any) {
    console.error("Error fetching dashboard metrics:", error);
    throw error.response?.data || { error: "Server error while fetching dashboard metrics" };
  }
  
}


// admindashboard recent activity

export const getRecentActivity = async () => {
  try {
    const res = await axiosInstance.get('/admin/recentActivity');
  return res.data;
  } catch (error: any) {
    console.error("Error fetching recent activity:", error);
    throw error.response?.data || { error: "Server error while fetching recent activity" };
    
  }
};


// admindshboard system health
export const getSystemHealth = async () => {
 try {
   const res = await axiosInstance.get('/admin/systemHealth');
  return res.data;
 } catch (error: any) {
    console.error("Error fetching system health:", error);
    throw error.response?.data || { error: "Server error while fetching system health" };
  }
  
 };

//  admin user delete
export const getdeleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw error.response?.data || { error: "Server error while deleting user" };
  }
}

// get user by id
export const getUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    throw error.response?.data || { error: "Server error while fetching user by ID" };
  }
}

// put user by id
export const putUserById = async (userId: string, userData: any) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user by ID:", error);
    throw error.response?.data || { error: "Server error while updating user by ID" };
  }
}
