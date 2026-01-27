import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/guides`,
});

// This interceptor will add the token to the request headers if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if(token){
        config.headers['auth-token'] = token;
    }

    return config;
}, (error) =>{
    return Promise.reject(error);
});

// API 1: Register a new guide
export const GuidesRegistration = async (guideData) => {
    try {
        const response = await api.post("/register", guideData);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Guide Registration failed due to a server error." };
    }
}

// API 2: Get all guides (Admin only)
export const GetAllGuides = async () => {
    try {
        const response = await api.get("/allguides");
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch guides due to a server error." };
    }
}

// API 3: Get all pending guides (Admin only)
export const GetAllPendingGuides = async () => {
    try {
        const response = await api.get("/pendingguides");
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch pending guides due to a server error." };
    }
}

// API 4: Get all approved guides (Admin only)
export const GetAllApprovedGuides = async () => {
    try {
        const response = await api.get("/approvedguides");
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch approved guides due to a server error." };
    }
}

// API 5: Approve or reject a guide application (Admin only)
export const UpdateGuideStatus = async (guideId, status) => {
    try {
        const response = await api.patch(`/status/${guideId}`, { status } );
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to update guide status due to a server error." };
    }
}

// API 6: Delete account(7-days grace period) 
export const DeleteAccount = async (guideId) => {
    try {
        const response = await api.delete(`/delete-account/${guideId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to delete account due to a server error." };
    }
}

// API 7: Reactivate account
export const ReactivateAccount = async (guideId) => {
    try {
        const response = await api.post(`/reactivate-account/${guideId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to reactivate account due to a server error." };
    }
}

// API 8: Total number of pending requests today (Admin only)
export const GetTodayPendingGuides = async () => {
    try {
        const response = await api.get("/todaypendingguides");
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch pending guides due to a server error." };
    }
}

// API 9: Total number of users (Admin only)
export const GetTotalUsers = async () => {
    try {
        const response = await api.get("/totalusers");
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch total users due to a server error." };
    }
}

// API 10: Check guides availibility
export const CheckGuidesAvailability = async (languages, checkIn, checkOut) => {
    try {
        const response = await api.post("/check-availability", { languages, checkIn, checkOut });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to check guides availability due to a server error." };
    }
}

// API 11: Toggle Availability
export const ToggleGuideAvailability = async (userId) => {
    try {
        const response = await api.patch(`/toggle-availability/${userId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to toggle guide availability due to a server error." };
    }
}

// API 12: Check Guide Profile is active or not
export const SyncAvailability = async (userId) => {
    try {
        const response = await api.get(`/sync-availability/${userId}`);
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to sync guide availability due to a server error." };
    }
}

// API 13: Get active guides (Admin only)
export const GetActiveGuides = async () => {
    try {
        const response = await api.get("/activeguides");
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch active guides due to a server error." };
    }
}