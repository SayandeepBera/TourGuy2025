import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance for reuse
const api = axios.create({
    baseURL: `${API_URL}/api/concierge`,
});

// This interceptor will add the token to the request headers if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if(token) {
        config.headers['auth-token'] = token;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// API 1: Create Concierge Request
export const CreateConciergeRequest = async (name, email, message) => {
    try {
        const response = await api.post('/newrequest', { name, email, message });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to create concierge request due to a server error." };
    }
}

// API 2: Get all concierge requests (Admin only)
export const GetAllConciergeRequests = async () => {
    try {
        const response = await api.get('/allrequests');
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to fetch concierge requests due to a server error." };
    }
}

// API 3: Update a concierge request status (Admin only)
export const UpdateConciergeRequestStatus = async (requestId, status) => {
    try {
        const response = await api.patch(`/updaterequest/${requestId}`, { status });
        return response.data;
    } catch (error) {
        return { success : false, error : error.response?.data?.error || "Failed to update concierge request status due to a server error." };
    }
}