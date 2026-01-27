import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/userprofile`,
});

// API 1: Get user profile details
export const GetUserProfile = async (userId) => {
    try {
        const response = await api.get(`/${userId}`);
        return response.data;
    } catch (error) {
        return { success: false, error: error.response?.data?.error || "Failed to fetch user profile due to a server error." };
    }
}

// API 2: Update user profile details
export const UpdateUserProfile = async (userId, profileData) => {
    try {
        const response = await api.put(`/update/${userId}`, profileData);
        return response.data;
    } catch (error) {
        return { success: false, error: error.response?.data?.error || "Failed to update user profile due to a server error." };
    }
}